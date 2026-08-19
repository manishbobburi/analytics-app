import { InboxIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function EmptyEvents() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>No Events</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          No events have been recorded for the selected date range. Try adjusting your date range or
          filters to see more events.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
