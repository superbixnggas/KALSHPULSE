// Kalshi Data Fetcher - Fetches market data from Kalshi API and stores in Supabase
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        const KALSHI_API_BASE = 'https://api.elections.kalshi.com/trade-api/v2';

        // Fetch markets from Kalshi API
        const marketsResponse = await fetch(`${KALSHI_API_BASE}/markets?limit=50&status=open`, {
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!marketsResponse.ok) {
            const errorText = await marketsResponse.text();
            throw new Error(`Kalshi API error: ${marketsResponse.status} - ${errorText}`);
        }

        const marketsData = await marketsResponse.json();
        const markets = marketsData.markets || [];

        const results = {
            eventsProcessed: 0,
            snapshotsCreated: 0,
            errors: [] as string[]
        };

        for (const market of markets) {
            try {
                // Calculate probabilities from bid/ask
                const yesBid = market.yes_bid || 0;
                const yesAsk = market.yes_ask || 0;
                const yesProbability = yesBid > 0 && yesAsk > 0 ? ((yesBid + yesAsk) / 2) : (market.last_price || 50);
                const noProbability = 100 - yesProbability;

                // Check if event exists
                const checkEventResponse = await fetch(
                    `${supabaseUrl}/rest/v1/events?ticker=eq.${encodeURIComponent(market.ticker)}&select=id`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                const existingEvents = await checkEventResponse.json();
                let eventId: number;

                if (existingEvents && existingEvents.length > 0) {
                    eventId = existingEvents[0].id;
                    
                    // Update existing event
                    await fetch(`${supabaseUrl}/rest/v1/events?id=eq.${eventId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            updated_at: new Date().toISOString(),
                            is_active: market.status === 'open'
                        })
                    });
                } else {
                    // Insert new event
                    const insertEventResponse = await fetch(`${supabaseUrl}/rest/v1/events`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        body: JSON.stringify({
                            source_event_id: market.event_ticker || market.ticker,
                            ticker: market.ticker,
                            title: market.title || market.ticker,
                            category: market.category || 'General',
                            deadline: market.close_time || null,
                            is_active: market.status === 'open'
                        })
                    });

                    if (!insertEventResponse.ok) {
                        const errorText = await insertEventResponse.text();
                        results.errors.push(`Failed to insert event ${market.ticker}: ${errorText}`);
                        continue;
                    }

                    const insertedEvent = await insertEventResponse.json();
                    eventId = insertedEvent[0].id;
                }

                // Get previous snapshot for 24h change calculation
                const prevSnapshotResponse = await fetch(
                    `${supabaseUrl}/rest/v1/event_market_snapshot?event_id=eq.${eventId}&order=timestamp.desc&limit=1`,
                    {
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey
                        }
                    }
                );

                const prevSnapshots = await prevSnapshotResponse.json();
                let change24h = 0;
                
                if (prevSnapshots && prevSnapshots.length > 0) {
                    const prevYes = prevSnapshots[0].yes_probability || 50;
                    change24h = yesProbability - prevYes;
                }

                // Insert market snapshot
                const snapshotResponse = await fetch(`${supabaseUrl}/rest/v1/event_market_snapshot`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        event_id: eventId,
                        yes_probability: yesProbability,
                        no_probability: noProbability,
                        volume: market.volume || 0,
                        change_24h: change24h,
                        raw_data: {
                            ticker: market.ticker,
                            yes_bid: market.yes_bid,
                            yes_ask: market.yes_ask,
                            no_bid: market.no_bid,
                            no_ask: market.no_ask,
                            last_price: market.last_price,
                            open_interest: market.open_interest,
                            status: market.status
                        }
                    })
                });

                if (snapshotResponse.ok) {
                    results.snapshotsCreated++;
                } else {
                    const errorText = await snapshotResponse.text();
                    results.errors.push(`Snapshot error for ${market.ticker}: ${errorText}`);
                }

                results.eventsProcessed++;
            } catch (marketError) {
                results.errors.push(`Error processing ${market.ticker}: ${marketError.message}`);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Kalshi data fetcher error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'FETCH_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
