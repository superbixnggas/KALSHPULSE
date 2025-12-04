// Get Event Detail - API endpoint to get event details with historical data
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

        // Get event ID from request
        let eventId: number;
        
        if (req.method === 'POST') {
            const body = await req.json();
            eventId = body.eventId;
        } else {
            const url = new URL(req.url);
            eventId = parseInt(url.searchParams.get('eventId') || '0');
        }

        if (!eventId) {
            throw new Error('Event ID is required');
        }

        // Fetch event
        const eventResponse = await fetch(
            `${supabaseUrl}/rest/v1/events?id=eq.${eventId}&select=*`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const events = await eventResponse.json();
        if (!events || events.length === 0) {
            throw new Error('Event not found');
        }
        const event = events[0];

        // Fetch market snapshots for chart (last 100 entries)
        const snapshotsResponse = await fetch(
            `${supabaseUrl}/rest/v1/event_market_snapshot?event_id=eq.${eventId}&order=timestamp.asc&limit=100`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );
        const snapshots = await snapshotsResponse.json();

        // Fetch latest market snapshot
        const latestSnapshotResponse = await fetch(
            `${supabaseUrl}/rest/v1/event_market_snapshot?event_id=eq.${eventId}&order=timestamp.desc&limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );
        const latestSnapshots = await latestSnapshotResponse.json();
        const latestSnapshot = latestSnapshots && latestSnapshots.length > 0 ? latestSnapshots[0] : null;

        // Fetch latest AI prediction
        const predictionResponse = await fetch(
            `${supabaseUrl}/rest/v1/event_ai_prediction?event_id=eq.${eventId}&order=timestamp.desc&limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );
        const predictions = await predictionResponse.json();
        const latestPrediction = predictions && predictions.length > 0 ? predictions[0] : null;

        // Fetch AI prediction history
        const predictionHistoryResponse = await fetch(
            `${supabaseUrl}/rest/v1/event_ai_prediction?event_id=eq.${eventId}&order=timestamp.desc&limit=20`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );
        const predictionHistory = await predictionHistoryResponse.json();

        // Prepare chart data
        const chartData = snapshots.map((s: any) => ({
            timestamp: s.timestamp,
            yes_probability: s.yes_probability,
            no_probability: s.no_probability,
            volume: s.volume
        }));

        return new Response(JSON.stringify({
            success: true,
            data: {
                event: event,
                market_data: latestSnapshot ? {
                    yes_probability: latestSnapshot.yes_probability,
                    no_probability: latestSnapshot.no_probability,
                    volume: latestSnapshot.volume,
                    change_24h: latestSnapshot.change_24h,
                    raw_data: latestSnapshot.raw_data,
                    timestamp: latestSnapshot.timestamp
                } : null,
                ai_prediction: latestPrediction ? {
                    ai_yes_probability: latestPrediction.ai_yes_probability,
                    ai_winner: latestPrediction.ai_winner,
                    status: latestPrediction.status,
                    insight_faktor_pendukung: latestPrediction.insight_faktor_pendukung,
                    insight_faktor_hambatan: latestPrediction.insight_faktor_hambatan,
                    insight_risiko: latestPrediction.insight_risiko,
                    timestamp: latestPrediction.timestamp
                } : null,
                chart_data: chartData,
                prediction_history: predictionHistory
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Get event detail error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'FETCH_EVENT_DETAIL_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
