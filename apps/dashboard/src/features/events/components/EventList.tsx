import { useEffect } from 'react';

import { EventsTablePagination } from './EventTablePagination';
import { EventsTable } from './EventTable';
import { EmptyEvents } from './EmptyEvents';
import { EventTableSkeleton } from './EventsTableSkeleton';
import { useEvents } from '../hooks';

export function EventsList() {
  const { data, isPending, page, setPageParam, setLimitParam } = useEvents();

  const events = data?.events ?? [];
  const pagination = data?.pagination;

  useEffect(() => {
    if (!data?.pagination) {
      return;
    }

    const totalPages = data.pagination.totalPages;

    if (totalPages === 0) {
      if (page !== '1') {
        setPageParam('1');
      }

      return;
    }

    const currentPage = Number(page);

    if (currentPage > totalPages) {
      setPageParam(String(totalPages));
    }
  }, [data?.pagination, page, setPageParam]);

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
          onPageChange={setPageParam}
          onLimitChange={setLimitParam}
        />
      )}
    </div>
  );
}
