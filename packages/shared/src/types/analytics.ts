export interface AnalyticsEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  data: Record<string, unknown>;
  format: 'pdf' | 'csv' | 'json';
}
