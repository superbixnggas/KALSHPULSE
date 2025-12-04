// AI Prediction - Uses OpenRouter API to generate predictions for events
Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        const { eventId, forceRefresh } = await req.json();

        if (!eventId) {
            throw new Error('Event ID is required');
        }

        // Fetch event details
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

        // Fetch latest market snapshot
        const snapshotResponse = await fetch(
            `${supabaseUrl}/rest/v1/event_market_snapshot?event_id=eq.${eventId}&order=timestamp.desc&limit=10`,
            {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey
                }
            }
        );

        const snapshots = await snapshotResponse.json();
        if (!snapshots || snapshots.length === 0) {
            throw new Error('No market data available');
        }

        const latestSnapshot = snapshots[0];
        
        // Calculate historical trend
        let historicalTrend = 'stable';
        if (snapshots.length >= 3) {
            const recentAvg = (snapshots[0].yes_probability + snapshots[1].yes_probability) / 2;
            const olderAvg = (snapshots[snapshots.length - 2].yes_probability + snapshots[snapshots.length - 1].yes_probability) / 2;
            if (recentAvg - olderAvg > 5) historicalTrend = 'rising';
            else if (olderAvg - recentAvg > 5) historicalTrend = 'falling';
        }

        // Build AI prompt
        const prompt = `Analisa data berikut.
Event: ${event.title}
Market Yes Probability: ${latestSnapshot.yes_probability} persen
Market No Probability: ${latestSnapshot.no_probability} persen
Volume: ${latestSnapshot.volume}
Price movement 24h: ${latestSnapshot.change_24h} persen
Historical trend: ${historicalTrend}
Deadline: ${event.deadline || 'Tidak ditentukan'}

Instruksi:
1. Hitung probabilitas outcome berdasarkan data yang tersedia
2. Tentukan siapa yang lebih mungkin menang, YES atau NO
3. Berikan alasan yang hanya berasal dari data input
4. Jika data tidak cukup untuk alasan, tulis bahwa data tidak cukup
5. Tentukan status:
   - Opportunity jika probabilitas AI jauh lebih tinggi dibanding market (selisih > 10%)
   - Balanced jika probabilitas AI hampir sama dengan market (selisih <= 10%)
   - Risk Zone jika volatilitas tinggi atau data tidak konsisten

Format output WAJIB dalam JSON (tanpa markdown):
{
  "prediction": "YES atau NO",
  "ai_probability": angka 0-100,
  "status": "Opportunity atau Balanced atau Risk Zone",
  "faktor_pendukung": "penjelasan singkat",
  "faktor_hambatan": "penjelasan singkat",
  "risiko": "penjelasan singkat"
}`;

        let aiResult = {
            prediction: 'YES',
            ai_probability: latestSnapshot.yes_probability,
            status: 'Balanced',
            faktor_pendukung: 'Berdasarkan probabilitas market saat ini',
            faktor_hambatan: 'Volatilitas pasar prediction market',
            risiko: 'Perubahan kondisi mendadak dapat mempengaruhi outcome'
        };

        // Call OpenRouter API if key is available
        if (openrouterApiKey) {
            try {
                const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${openrouterApiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': supabaseUrl,
                        'X-Title': 'Kalshi Pulse'
                    },
                    body: JSON.stringify({
                        model: 'openai/gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: 'Kamu adalah analis prediction market yang ahli. Berikan analisis dalam format JSON yang valid tanpa markdown formatting.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        temperature: 0.3,
                        max_tokens: 500
                    })
                });

                if (aiResponse.ok) {
                    const aiData = await aiResponse.json();
                    const content = aiData.choices?.[0]?.message?.content || '';
                    
                    // Parse JSON from response
                    try {
                        // Remove markdown code blocks if present
                        let jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                        const parsed = JSON.parse(jsonStr);
                        
                        aiResult = {
                            prediction: parsed.prediction || 'YES',
                            ai_probability: typeof parsed.ai_probability === 'number' ? parsed.ai_probability : latestSnapshot.yes_probability,
                            status: parsed.status || 'Balanced',
                            faktor_pendukung: parsed.faktor_pendukung || 'Data tidak cukup',
                            faktor_hambatan: parsed.faktor_hambatan || 'Data tidak cukup',
                            risiko: parsed.risiko || 'Data tidak cukup'
                        };
                    } catch (parseError) {
                        console.error('Failed to parse AI response:', parseError);
                    }
                }
            } catch (aiError) {
                console.error('AI API error:', aiError);
            }
        } else {
            // Fallback logic when no API key
            const yesProbability = latestSnapshot.yes_probability || 50;
            
            if (yesProbability > 60) {
                aiResult.prediction = 'YES';
                aiResult.ai_probability = yesProbability + (Math.random() * 5 - 2.5);
            } else if (yesProbability < 40) {
                aiResult.prediction = 'NO';
                aiResult.ai_probability = yesProbability - (Math.random() * 5 - 2.5);
            } else {
                aiResult.prediction = yesProbability >= 50 ? 'YES' : 'NO';
                aiResult.ai_probability = yesProbability;
            }
            
            // Determine status based on confidence
            const diff = Math.abs(aiResult.ai_probability - yesProbability);
            if (diff > 10) {
                aiResult.status = 'Opportunity';
            } else if (Math.abs(latestSnapshot.change_24h) > 10) {
                aiResult.status = 'Risk Zone';
            } else {
                aiResult.status = 'Balanced';
            }
        }

        // Ensure ai_probability is within bounds
        aiResult.ai_probability = Math.max(0, Math.min(100, aiResult.ai_probability));

        // Save prediction to database
        const predictionResponse = await fetch(`${supabaseUrl}/rest/v1/event_ai_prediction`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                event_id: eventId,
                market_yes_probability: latestSnapshot.yes_probability,
                market_no_probability: latestSnapshot.no_probability,
                ai_yes_probability: aiResult.prediction === 'YES' ? aiResult.ai_probability : (100 - aiResult.ai_probability),
                ai_winner: aiResult.prediction,
                status: aiResult.status,
                insight_faktor_pendukung: aiResult.faktor_pendukung,
                insight_faktor_hambatan: aiResult.faktor_hambatan,
                insight_risiko: aiResult.risiko
            })
        });

        if (!predictionResponse.ok) {
            const errorText = await predictionResponse.text();
            throw new Error(`Failed to save prediction: ${errorText}`);
        }

        const savedPrediction = await predictionResponse.json();

        return new Response(JSON.stringify({
            success: true,
            data: {
                prediction: savedPrediction[0],
                event: event,
                latestSnapshot: latestSnapshot
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI Prediction error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: {
                code: 'PREDICTION_ERROR',
                message: error.message
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
