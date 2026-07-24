import { z } from 'zod';
import { EventSchema } from '../schemas/index.js';

export type EventInput = z.infer<typeof EventSchema>;

export interface NormalizedEvent {
  eventId: string;
  event: string;
  timestamp: Date;
  orgId: string;
  anonId: string;
  sessionId: string;
  userId?: string;
  properties: Record<string, unknown>;
  context: {
    pageUrl: string;
    pagePath?: string;
    pageTitle: string;
    referrer?: string;
    userAgent: string;
    browserName?: string;
    osName?: string;
    deviceType?: string;
    screenWidth: number;
    screenHeight: number;
    language?: string;
    timezone?: string;
  };
  contentId?: string;
  contentType?: string;
  pageUrl: string;
  pagePath?: string;
  referrer?: string;
  browserName?: string;
  osName?: string;
  deviceType?: string;
  language?: string;
  timezone?: string;
}
