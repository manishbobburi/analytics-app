import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ExportDatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
}

export function ExportDatePicker({
  value,
  onChange,
  placeholder,
  disabled = false,
  disabledDate,
}: ExportDatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 size-4" />

        {value ? format(value, 'PPP') : placeholder}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            if (date) {
              setOpen(false);
            }
          }}
          disabled={disabledDate}
        />
      </PopoverContent>
    </Popover>
  );
}
