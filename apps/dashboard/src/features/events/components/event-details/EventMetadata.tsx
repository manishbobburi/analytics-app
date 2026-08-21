import type { EventDetail } from '../../types';
import { Card, CardContent } from '@/components/ui/card';

interface EventMetadataProps {
  event: EventDetail;
}

export function EventMetadata({ event }: EventMetadataProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">Event information</h3>

      <Card className="shadow-none">
        <CardContent className="p-0">
          <MetadataGrid
            items={[
              ['Event ID', event.eventId],
              ['User ID', event.userId],
              ['Anonymous ID', event.anonId],
              ['Session ID', event.sessionId],
              ['Page path', event.pagePath],
              ['Page URL', event.pageUrl],
              ['Referrer', event.referrer],
              ['Browser', event.browserName],
              ['OS', event.osName],
              ['Device', event.deviceType],
              ['Language', event.language],
              ['Timezone', event.timezone],
              ['Content ID', event.contentId],
              ['Content type', event.contentType],
            ]}
          />
        </CardContent>
      </Card>
    </section>
  );
}

function MetadataGrid({ items }: { items: Array<[string, unknown]> }) {
  return (
    <div className="divide-y">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 px-4 py-3">
          <span className="text-xs text-muted-foreground">{label}</span>

          <span className="min-w-0 wrap-break-word text-sm">{formatValue(value)}</span>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value);
}
