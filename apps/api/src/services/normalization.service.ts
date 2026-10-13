import { EventInput, NormalizedEvent } from '@click-stream/shared';
import { UAParser } from 'ua-parser-js';

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

function normalizeEvent(orgId: string, event: EventInput): NormalizedEvent {
  const { browser, os, device } = UAParser(event.context.user_agent);

  return {
    eventId: event.event_id,
    event: normalizeEventName(event.event),
    timestamp: normalizeTimestamp(event.timestamp),
    orgId: orgId,
    anonId: event.anon_id,
    sessionId: event.session_id,
    userId: normalizeUserId(event.user_id),
    properties: event.properties,
    context: {
      pageUrl: event.context.page_url,
      pageTitle: event.context.page_title,
      pagePath: event.context.page_path,
      referrer: event.context.referrer,
      userAgent: event.context.user_agent,
      browserName: browser.name ?? 'Unknown',
      osName: os.name ?? 'Unknown',
      deviceType: device.type ?? 'desktop',
      screenWidth: event.context.screen_width,
      screenHeight: event.context.screen_height,
      language: event.context.language,
      timezone: event.context.timezone,
    },
    pageUrl: event.context.page_url,
    pagePath: event.context.page_path,
    referrer: event.context.referrer,
    browserName: browser.name ?? 'Unknown',
    osName: os.name ?? 'Unknown',
    deviceType: device.type ?? 'desktop',
    language: event.context.language,
    timezone: event.context.timezone,
  };
}

function normalizeBatch(orgId: string, events: EventInput[]): NormalizedEvent[] {
  return events.map((event) => normalizeEvent(orgId, event));
}

export { normalizeBatch };
