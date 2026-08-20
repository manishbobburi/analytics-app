import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventsPageSize } from '../types';

interface EventsTablePaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  isLoading?: boolean;
  onPageChange: (page: string) => void;
  onLimitChange: (limit: EventsPageSize) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function EventsTablePagination({
  page,
  limit,
  total,
  totalPages,
  hasNext,
  isLoading,
  onPageChange,
  onLimitChange,
}: EventsTablePaginationProps) {
  const currentPage = Number(page);
  const hasPrevious = currentPage > 1;

  return (
    <div className="flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        {total.toLocaleString()} {total === 1 ? 'event' : 'events'}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden sm:inline">Rows per page</span>

          <Select
            value={String(limit)}
            onValueChange={(value) => {
              onLimitChange(value as EventsPageSize);
            }}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="whitespace-nowrap text-sm">
          Page {page} of {Math.max(totalPages, 1)}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!hasPrevious || isLoading}
            onClick={() => onPageChange(String(page - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!hasNext || isLoading}
            onClick={() => onPageChange(String(page + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
