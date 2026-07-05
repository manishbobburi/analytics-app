export interface NormalizedEvent {
  eventId: string;
  event: string;
  timestamp: Date;
  anonId: string;
  sessionId: string;
  userId?: string;
  properties: Record<string, unknown>;
  context: {
    pageUrl: string;
    pageTitle: string;
    referrer?: string;
    userAgent: string;
    screenWidth: number;
    language: string;
  };
}
