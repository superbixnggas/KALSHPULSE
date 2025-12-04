-- Migration: setup_rls_and_indexes
-- Created at: 1764871884


-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_market_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_ai_prediction ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events table
CREATE POLICY "Allow public read access on events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Allow edge function insert on events" ON events
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Allow edge function update on events" ON events
  FOR UPDATE USING (auth.role() IN ('anon', 'service_role'));

-- RLS Policies for event_market_snapshot table
CREATE POLICY "Allow public read access on event_market_snapshot" ON event_market_snapshot
  FOR SELECT USING (true);

CREATE POLICY "Allow edge function insert on event_market_snapshot" ON event_market_snapshot
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- RLS Policies for event_ai_prediction table
CREATE POLICY "Allow public read access on event_ai_prediction" ON event_ai_prediction
  FOR SELECT USING (true);

CREATE POLICY "Allow edge function insert on event_ai_prediction" ON event_ai_prediction
  FOR INSERT WITH CHECK (auth.role() IN ('anon', 'service_role'));

-- Create indexes for better query performance
CREATE INDEX idx_events_source_event_id ON events(source_event_id);
CREATE INDEX idx_events_ticker ON events(ticker);
CREATE INDEX idx_events_is_active ON events(is_active);
CREATE INDEX idx_event_market_snapshot_event_id ON event_market_snapshot(event_id);
CREATE INDEX idx_event_market_snapshot_timestamp ON event_market_snapshot(timestamp);
CREATE INDEX idx_event_ai_prediction_event_id ON event_ai_prediction(event_id);
CREATE INDEX idx_event_ai_prediction_timestamp ON event_ai_prediction(timestamp);
;