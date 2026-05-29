export interface PulseConfig {
  apiKey: string;
  apiUrl?: string; // default https://api.pulse.dev
  flushInterval?: number; // ms, default 3000
  batchSize?: number; // default 10
  consent?: boolean; // default true
}

export interface BaseEvent {
  event: string;
  timestamp: number;
  anon_id: string;
  session_id: string;
  user_id?: string;
  properties: Record<string, any>;
  context: {
    page_url: string;
    page_title: string;
    referrer: string;
    user_agent: string;
    screen_width: number;
    language: string;
  };
}

export interface ContentProperties {
  content_id: string;
  content_type: 'text' | 'image' | 'video' | 'audio' | 'mixed' | 'product';
  title?: string;
  duration_ms?: number;
  position_ms?: number;
  percent?: number;
  price?: number;
  [key: string]: any;
}
