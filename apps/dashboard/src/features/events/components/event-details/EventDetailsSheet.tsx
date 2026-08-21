import { useEvent } from '../../hooks';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { EventDetailsContent } from './EventDetailsContent';
import { QueryError } from '@/components/common/QueryError';

interface EventDetailsSheetProps {
  eventId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventDetailsSheet({ eventId, open, onOpenChange }: EventDetailsSheetProps) {
  const { data: event, isPending, isError, refetch } = useEvent(eventId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle>Event details</SheetTitle>
          <SheetDescription>Inspect the complete event payload and context</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isPending && <EventDetailsSkeleton />}

          {isError && (
            <div className="p-6">
              <QueryError
                title="Unable to load event"
                description="Something went wrong while fetching this event."
                onRetry={refetch}
              />
            </div>
          )}

          {event && !isPending && !isError && <EventDetailsContent event={event} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EventDetailsSkeleton() {
  return (
    <div className="space-y-6 px-6 py-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />

        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
