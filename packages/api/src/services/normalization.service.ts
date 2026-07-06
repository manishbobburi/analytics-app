import { EventInput } from '../schemas/index.js';
import { NormalizedEvent } from '../types/index.js';

function normalizeTimestamp(timestamp: string | number | Date): Date {
  return new Date(timestamp);
}

function normalizeEventName(event: string): string {
  return event.trim().toLowerCase().replace(/\s+/g, '_');
}

function normalizeUserId(userId?: string): string | undefined {
  if (!userId) return undefined;

  const trimmed = userId.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeEvent(event: EventInput): NormalizedEvent {
  return {
    eventId: event.event_id,
    event: normalizeEventName(event.event),
    timestamp: normalizeTimestamp(event.timestamp),
    anonId: event.anon_id,
    sessionId: event.session_id,
    userId: normalizeUserId(event.user_id),
    properties: event.properties,
    context: {
      pageUrl: event.context.page_url,
      pageTitle: event.context.page_title,
      referrer: event.context.referrer,
      userAgent: event.context.user_agent,
      screenWidth: event.context.screen_width,
      language: event.context.language,
    },
    pageUrl: event.context.page_url,
    referrer: event.context.referrer,
    userAgent: event.context.user_agent,
    language: event.context.language,
    screenWidth: event.context.screen_width,
  };
}

export { normalizeEvent };
