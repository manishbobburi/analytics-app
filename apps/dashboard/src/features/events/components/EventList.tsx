import { useState } from 'react';

import { EventsTablePagination } from './EventTablePagination';
import { EventsTable } from './EventTable';
import { EmptyEvents } from './EmptyEvents';
import { EventTableSkeleton } from './EventsTableSkeleton';
import { useEvents } from '../hooks';
import type { EventsQuery } from '../types';

export function EventsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const EQuery: EventsQuery = {
    page,
    limit,
    sort: 'desc',
  };

  const { data, isPending } = useEvents(EQuery);

  const events = data?.events ?? [];
  const pagination = data?.pagination;

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  function handleLimitChange(nextLimit: number) {
    setLimit(nextLimit);
    setPage(1);
  }

  if (isPending) {
    return <EventTableSkeleton />;
  }

  if (events.length == 0) {
    return <EmptyEvents />;
  }
  return (
    <div>
      <EventsTable data={events} />

      {pagination && (
        <EventsTablePagination
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          isLoading={isPending}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  );
}
