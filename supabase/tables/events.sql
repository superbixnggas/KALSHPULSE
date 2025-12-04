CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    source_event_id TEXT UNIQUE,
    ticker TEXT,
    title TEXT NOT NULL,
    category TEXT,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);