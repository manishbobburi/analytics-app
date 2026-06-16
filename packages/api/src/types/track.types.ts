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
