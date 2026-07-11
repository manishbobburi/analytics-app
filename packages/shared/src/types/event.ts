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
    pageTitle: string;
    referrer?: string;
    userAgent: string;
    screenWidth: number;
    language: string;
  };
  pageUrl: string;
  referrer?: string;
  userAgent: string;
  language: string;
  screenWidth: number;
}
