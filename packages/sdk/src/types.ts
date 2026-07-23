export interface PulseConfig {
  writeKey: string;
  apiUrl?: string;
  flushInterval?: number;
  batchSize?: number;
  consent?: boolean;
}

export interface BaseEvent {
  event_id: string;
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
