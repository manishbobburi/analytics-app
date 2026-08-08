import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useDashboardDateRange } from '../hooks';
import { DATE_RANGE_LABELS, formatDateForUrl } from '../date-range';
import { type DashboardDateRange, type DateRangePreset } from '../types';

const PRESET_OPTIONS: DateRangePreset[] = [
  'today',
  'yesterday',
  'last-7-days',
  'last-30-days',
  'last-90-days',
  'this-month',
  'last-month',
];

export function DateRangeSelector() {
  const { dateRange, setDateRange } = useDashboardDateRange();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(
    getInitialCalendarRange(dateRange)
  );
  const [isSelectingCustomRange, setIsSelectingCustomRange] = useState(
    dateRange.preset === 'custom'
  );

  useEffect(() => {
    setCustomRange(getInitialCalendarRange(dateRange));
    setIsSelectingCustomRange(dateRange.preset === 'custom');
  }, [dateRange]);

  function handlePresetChange(preset: DateRangePreset) {
    if (preset === 'custom') {
      setIsSelectingCustomRange(true);
      return;
    }

    setIsSelectingCustomRange(false);

    setDateRange({
      preset,
    });

    setCalendarOpen(false);
  }

  function handleCalendarChange(range: DateRange | undefined) {
    setCustomRange(range);

    if (!range?.from || !range?.to) {
      return;
    }

    setDateRange({
      preset: 'custom',
      from: formatDateForUrl(range.from),
      to: formatDateForUrl(range.to),
    });

    setCalendarOpen(false);
  }

  const label = getDateRangeLabel(dateRange);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger render={<Button variant="outline" className="min-w-37.5 justify-between" />}>
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4" />
          {label}
        </span>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-auto p-0">
        <div className="flex">
          <div
            className={cn('flex flex-col p-2', isSelectingCustomRange ? 'w-44 border-r' : 'w-64')}
          >
            {PRESET_OPTIONS.map((preset) => (
              <Button
                key={preset}
                variant={dateRange.preset === preset ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => handlePresetChange(preset)}
              >
                {DATE_RANGE_LABELS[preset]}
              </Button>
            ))}

            <Button
              variant={dateRange.preset === 'custom' ? 'secondary' : 'ghost'}
              className="justify-start"
              onClick={() => handlePresetChange('custom')}
            >
              Custom range
            </Button>
          </div>

          {isSelectingCustomRange && (
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={handleCalendarChange}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getInitialCalendarRange(dateRange: DashboardDateRange): DateRange | undefined {
  if (dateRange.preset !== 'custom' || !dateRange.from || !dateRange.to) {
    return undefined;
  }

  return {
    from: parseISO(dateRange.from),
    to: parseISO(dateRange.to),
  };
}

function getDateRangeLabel(dateRange: DashboardDateRange): string {
  if (dateRange.preset !== 'custom') {
    return DATE_RANGE_LABELS[dateRange.preset];
  }

  if (!dateRange.from || !dateRange.to) {
    return DATE_RANGE_LABELS.custom;
  }

  return `${format(parseISO(dateRange.from), 'MMM d')} - ${format(
    parseISO(dateRange.to),
    'MMM d, yyyy'
  )}`;
}
