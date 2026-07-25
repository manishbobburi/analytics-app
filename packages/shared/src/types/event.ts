import { z } from 'zod';
import { EventSchema, GetEventSchema } from '../schemas/index.js';

export type EventInput = z.infer<typeof EventSchema>;
export type GetEventsQuery = z.infer<typeof GetEventSchema>;

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

export interface EventFilters {
  orgId: string;
  event?: string;
  userId?: string;
  anonId?: string;
  sessionId?: string;
  browserName?: string;
  osName?: string;
  deviceType?: string;
  language?: string;
  timezone?: string;
  pagePath?: string;
  from?: Date;
  to?: Date;

  skip: number;
  take: number;
  sort: 'asc' | 'desc';
}
