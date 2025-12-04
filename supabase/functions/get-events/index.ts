// Get Events - API endpoint to list events with latest market data and AI predictions
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

        // Parse URL parameters
        const url = new URL(req.url);
        const category = url.searchParams.get('category');
        const status = url.searchParams.get('status');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Fetch events
        let eventsUrl = `${supabaseUrl}/rest/v1/events?is_active=eq.true&order=updated_at.desc&limit=${limit}&offset=${offset}`;
        
        if (category && category !== 'all') {
            eventsUrl += `&category=eq.${encodeURIComponent(category)}`;
        }

        const eventsResponse = await fetch(eventsUrl, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
            }
        });

        if (!eventsResponse.ok) {
            throw new Error('Failed to fetch events');
        }

        const events = await eventsResponse.json();

        // Fetch latest snapshot and AI prediction for each event
        const enrichedEvents = await Promise.all(events.map(async (event: any) => {
            // Get latest market snapshot
            const snapshotResponse = await fetch(
                `${supabaseUrl}/rest/v1/event_market_snapshot?event_id=eq.${event.id}&order=timestamp.desc&limit=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                }
            );
            const snapshots = await snapshotResponse.json();
            const latestSnapshot = snapshots && snapshots.length > 0 ? snapshots[0] : null;

            // Get latest AI prediction
            const predictionResponse = await fetch(
                `${supabaseUrl}/rest/v1/event_ai_prediction?event_id=eq.${event.id}&order=timestamp.desc&limit=1`,
                {
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey
                    }
                }
            );
            const predictions = await predictionResponse.json();
            const latestPrediction = predictions && predictions.length > 0 ? predictions[0] : null;

            return {
                ...event,
                market_data: latestSnapshot ? {
                    yes_probability: latestSnapshot.yes_probability,
                    no_probability: latestSnapshot.no_probability,
                    volume: latestSnapshot.volume,
                    change_24h: latestSnapshot.change_24h,
                    timestamp: latestSnapshot.timestamp
                } : null,
                ai_prediction: latestPrediction ? {
                    ai_yes_probability: latestPrediction.ai_yes_probability,
                    ai_winner: latestPrediction.ai_winner,
                    status: latestPrediction.status,
                    timestamp: latestPrediction.timestamp
                } : null
            };
        }));

        // Filter by status if specified
        let filteredEvents = enrichedEvents;
        if (status && status !== 'all') {
            filteredEvents = enrichedEvents.filter((e: any) => 
                e.ai_prediction && e.ai_prediction.status === status
            );
        }

        // Get unique categories for filter options
        const categoriesResponse = await fetch(
            `${supabaseUrl}/rest/v1/events?is_active=eq.true&select=category`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );
        const categoriesData = await categoriesResponse.json();
        const categories = [...new Set(categoriesData.map((c: any) => c.category).filter(Boolean))];

        return new Response(JSON.stringify({
            success: true,
            data: {
                events: filteredEvents,
                total: filteredEvents.length,
                categories: categories,
                pagination: {
                    limit,
                    offset,
                    hasMore: events.length === limit
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get events error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'FETCH_EVENTS_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
