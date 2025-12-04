CREATE TABLE event_ai_prediction (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    market_yes_probability DECIMAL(5,2),
    market_no_probability DECIMAL(5,2),
    ai_yes_probability DECIMAL(5,2),
    ai_winner TEXT CHECK (ai_winner IN ('YES',
    'NO')),
    status TEXT CHECK (status IN ('Opportunity',
    'Balanced',
    'Risk Zone')),
    insight_faktor_pendukung TEXT,
    insight_faktor_hambatan TEXT,
    insight_risiko TEXT
);