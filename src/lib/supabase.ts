import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hczrquegpsgehiglprqq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjenJxdWVncHNnZWhpZ2xwcnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzA4MTksImV4cCI6MjA4MDI0NjgxOX0.6xSs8lhYy01WvIesHFVMgJ9wDbENk3Yk05V2IOj1NUc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const EDGE_FUNCTION_BASE = `${supabaseUrl}/functions/v1`;

// Common headers for edge functions
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'apikey': supabaseAnonKey,
});

// API Functions
export async function fetchEvents(params?: {
  category?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.set('category', params.category);
  if (params?.status) queryParams.set('status', params.status);
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const response = await fetch(`${EDGE_FUNCTION_BASE}/get-events?${queryParams}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
}

export async function fetchEventDetail(eventId: number) {
  const response = await fetch(`${EDGE_FUNCTION_BASE}/get-event-detail`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ eventId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch event detail');
  }

  return response.json();
}

export async function triggerAIPrediction(eventId: number) {
  const response = await fetch(`${EDGE_FUNCTION_BASE}/ai-prediction`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ eventId, forceRefresh: true }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate AI prediction');
  }

  return response.json();
}

// Types
export interface Event {
  id: number;
  source_event_id: string;
  ticker: string;
  title: string;
  category: string;
  deadline: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  market_data: {
    yes_probability: number;
    no_probability: number;
    volume: number;
    change_24h: number;
    timestamp: string;
  } | null;
  ai_prediction: {
    ai_yes_probability: number;
    ai_winner: 'YES' | 'NO';
    status: 'Opportunity' | 'Balanced' | 'Risk Zone';
    timestamp: string;
  } | null;
}

export interface EventDetail {
  event: Event;
  market_data: {
    yes_probability: number;
    no_probability: number;
    volume: number;
    change_24h: number;
    raw_data: any;
    timestamp: string;
  } | null;
  ai_prediction: {
    ai_yes_probability: number;
    ai_winner: 'YES' | 'NO';
    status: 'Opportunity' | 'Balanced' | 'Risk Zone';
    insight_faktor_pendukung: string;
    insight_faktor_hambatan: string;
    insight_risiko: string;
    timestamp: string;
  } | null;
  chart_data: {
    timestamp: string;
    yes_probability: number;
    no_probability: number;
    volume: number;
  }[];
  prediction_history: any[];
}
