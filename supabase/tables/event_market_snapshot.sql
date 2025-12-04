CREATE TABLE event_market_snapshot (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    yes_probability DECIMAL(5,2),
    no_probability DECIMAL(5,2),
    volume INTEGER,
    change_24h DECIMAL(5,2),
    raw_data JSONB
);