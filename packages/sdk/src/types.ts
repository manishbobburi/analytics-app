export type Primitive = string | number | boolean | null | undefined;

export type PropertyValue = Primitive | PropertyValue[] | { [key: string]: PropertyValue };

export type EventProperties = Record<string, PropertyValue>;

export interface ClickStreamConfig {
  writeKey: string;
  apiUrl: string;
  flushInterval?: number;
  batchSize?: number;
  maxQueueSize?: number;
  maxRetries?: number;
  requestTimeout?: number;
  consent?: boolean;
  debug?: boolean;
}

export interface ResolvedClickStreamConfig {
  writeKey: string;
  apiUrl: string;
  flushInterval: number;
  batchSize: number;
  maxQueueSize: number;
  maxRetries: number;
  requestTimeout: number;
  consent: boolean;
  debug: boolean;
}

export interface EventContext {
  page_url: string;
  page_path: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  screen_width: number;
  screen_height: number;
  language: string;
  timezone: string;
}

export interface BaseEvent {
  event_id: string;
  event: string;
  timestamp: number;
  anon_id: string;
  session_id: string;
  user_id?: string;
  properties: EventProperties;
  context: EventContext;
}

export interface IngestionPayload {
  write_key: string;
  batch: BaseEvent[];
}
