export const EVENT_EXPORT_FIELDS = [
  { value: 'eventId', label: 'Event ID' },
  { value: 'event', label: 'Event' },
  { value: 'timestamp', label: 'Timestamp' },
  { value: 'userId', label: 'User ID' },
  { value: 'anonId', label: 'Anonymous ID' },
  { value: 'sessionId', label: 'Session ID' },
  { value: 'pageUrl', label: 'Page URL' },
  { value: 'pagePath', label: 'Page Path' },
  { value: 'referrer', label: 'Referrer' },
  { value: 'browser', label: 'Browser' },
  { value: 'os', label: 'Operating System' },
  { value: 'device', label: 'Device' },
  { value: 'language', label: 'Language' },
  { value: 'timezone', label: 'Timezone' },
  { value: 'contentId', label: 'Content ID' },
  { value: 'contentType', label: 'Content Type' },
  { value: 'properties', label: 'Properties' },
] as const;

export type EventExportField = (typeof EVENT_EXPORT_FIELDS)[number]['value'];

export const EXPORT_FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'xlsx', label: 'Excel' },
] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number]['value'];
