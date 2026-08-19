import type { ColumnDef } from '@tanstack/react-table';

import type { EventListItem } from '../types';

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

function truncate(value: string, length = 16) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length)}…`;
}

export const eventColumns: ColumnDef<EventListItem>[] = [
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => <span>{row.original.event}</span>,
  },

  {
    accessorKey: 'timestamp',
    header: 'Timestamp',
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatTimestamp(row.original.timestamp)}</span>
    ),
  },

  {
    id: 'user',
    header: 'User',
    cell: ({ row }) => {
      const { userId } = row.original;

      if (userId) {
        return <span className="font-mono">{truncate(userId)}</span>;
      }

      return <span>Anonymous</span>;
    },
  },
  {
    accessorKey: 'sessionId',
    header: 'Session',
    cell: ({ row }) => (
      <span className="font-mono" title={row.original.sessionId!}>
        {truncate(row.original.sessionId!)}
      </span>
    ),
  },

  {
    accessorKey: 'pagePath',
    header: 'Page',
    cell: ({ row }) => (
      <span className="max-w-48 truncate" title={row.original.pagePath}>
        {row.original.pagePath}
      </span>
    ),
  },

  {
    accessorKey: 'deviceType',
    header: 'Device',
    cell: ({ row }) => <span className="capitalize">{row.original.deviceType ?? '—'}</span>,
  },

  {
    accessorKey: 'browserName',
    header: 'Browser',
    cell: ({ row }) => <span>{row.original.browserName ?? '—'}</span>,
  },
];
