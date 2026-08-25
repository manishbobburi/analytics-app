import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { WriteKey } from '../types';
import { WriteKeyDomainsCell } from './WriteKeyDomainsCell';

export const writeKeyColumns: ColumnDef<WriteKey>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
    cell: ({ row }) => <div className="max-w-55 truncate">{row.original.label}</div>,
  },

  {
    id: 'status',
    accessorFn: (row) => row.isActive,
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <Badge variant="outline" className="font-normal">
          {isActive ? 'Active' : 'Revoked'}
        </Badge>
      );
    },
  },

  {
    id: 'allowedDomains',
    accessorKey: 'allowedDomains',
    header: 'Allowed domains',
    cell: ({ row }) => <WriteKeyDomainsCell domains={row.original.allowedDomains} />,
  },

  {
    accessorKey: 'lastUsedAt',
    header: 'Last used',
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.original.lastUsedAt)}</span>
    ),
  },

  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>
    ),
  },
];

function formatDate(value: string | null): string {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
