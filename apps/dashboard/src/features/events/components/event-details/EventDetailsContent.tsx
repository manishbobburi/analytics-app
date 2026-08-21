import type { EventDetail } from '../../types';
import { EventMetadata } from './EventMetadata';
import { EventJsonViewer } from './EventJsonViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface EventDetailsContentProps {
  event: EventDetail;
}

export function EventDetailsContent({ event }: EventDetailsContentProps) {
  return (
    <div className="space-y-6 px-6 py-6">
      <EventHeader eventName={event.event} timestamp={event.timestamp} />

      <EventMetadata event={event} />

      {hasProperties(event.properties) && <EventProperties properties={event.properties} />}

      {event.context && (
        <Collapsible>
          <CollapsibleTrigger className="group flex w-full items-center justify-between border-y py-4 text-sm font-medium">
            <span>Context</span>

            <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>

          <CollapsibleContent className="pt-4">
            <MetadataGrid
              items={[
                ['Page title', event.context.pageTitle],
                ['Page path', event.context.pagePath],
                ['Page URL', event.context.pageUrl],
                ['Referrer', event.context.referrer],
                ['Browser', event.context.browserName],
                ['OS', event.context.osName],
                ['Device', event.context.deviceType],
                ['Language', event.context.language],
                ['Timezone', event.context.timezone],
                ['Screen', formatScreenSize(event.context.screenWidth, event.context.screenHeight)],
                ['User agent', event.context.userAgent],
              ]}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      <EventJsonViewer event={event} />
    </div>
  );
}

function EventHeader({ eventName, timestamp }: { eventName: string; timestamp: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground">Event</p>

      <h2 className="break-all text-lg font-semibold tracking-tight">{eventName}</h2>

      <p className="text-sm text-muted-foreground">{formatTimestamp(timestamp)}</p>
    </div>
  );
}

function EventProperties({ properties }: { properties: Record<string, unknown> }) {
  const items = Object.entries(properties);

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium">Properties</h3>

      <Card className="shadow-none">
        <CardContent className="p-0">
          <MetadataGrid items={items} />
        </CardContent>
      </Card>
    </section>
  );
}

function MetadataGrid({ items }: { items: Array<[string, unknown]> }) {
  return (
    <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0 px-4 py-3 sm:even:border-l">
          <p className="text-xs text-muted-foreground">{label}</p>

          <p className="mt-1 wrap-break-word text-sm font-medium">{formatValue(value)}</p>
        </div>
      ))}
    </div>
  );
}

function hasProperties(
  properties: Record<string, unknown> | null | undefined
): properties is Record<string, unknown> {
  return Boolean(properties && Object.keys(properties).length > 0);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

function formatScreenSize(
  width: number | null | undefined,
  height: number | null | undefined
): string {
  if (!width || !height) {
    return '—';
  }

  return `${width} × ${height}`;
}
