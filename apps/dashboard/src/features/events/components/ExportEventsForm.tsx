import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  EVENT_EXPORT_FIELDS,
  EXPORT_FORMATS,
  type ExportFormat,
  type EventExportField,
} from '@click-stream/shared';

import { ExportDatePicker } from './ExportDatePicker';
import { useExportEvents } from '../hooks';
import { downloadExportFile, getExportDateRange } from '../events';

const exportEventsSchema = z
  .object({
    format: z.enum(['csv', 'json', 'xlsx']),
    fields: z.array(z.string()).min(1, 'Select at least one field to export.'),

    from: z.date().optional(),
    to: z.date().optional(),
  })
  .refine((data) => data.from !== undefined, {
    path: ['from'],
    message: 'Select a start date.',
  })
  .refine((data) => data.to !== undefined, {
    path: ['to'],
    message: 'Select an end date.',
  })
  .refine((data) => data.from === undefined || data.to === undefined || data.from <= data.to, {
    path: ['to'],
    message: 'End date must be on or after the start date.',
  });

type ExportEventsFormValues = z.infer<typeof exportEventsSchema>;

interface ExportEventsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ExportEventsForm({ onSuccess, onCancel }: ExportEventsFormProps) {
  const exportMutation = useExportEvents();

  const form = useForm<ExportEventsFormValues>({
    resolver: zodResolver(exportEventsSchema),
    defaultValues: {
      format: 'csv',
      fields: ['eventId', 'event', 'userId'],
      from: undefined,
      to: undefined,
    },
  });

  async function onSubmit(values: ExportEventsFormValues) {
    try {
      if (!values.from || !values.to) {
        return;
      }

      const { from, to } = getExportDateRange(values.from, values.to);

      const { blob, filename } = await exportMutation.mutateAsync({
        format: values.format as ExportFormat,
        fields: values.fields as EventExportField[],
        from,
        to,
      });

      downloadExportFile(blob, filename ?? `events.${values.format}`);

      onSuccess();
    } catch {
      // Error is handled through mutation state below.
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>File format</FieldLabel>

          <RadioGroup
            value={form.watch('format')}
            onValueChange={(value) =>
              form.setValue('format', value as ExportEventsFormValues['format'], {
                shouldValidate: true,
              })
            }
            className="flex"
          >
            {EXPORT_FORMATS.map((format) => (
              <div key={format.value} className="flex items-center gap-3">
                <RadioGroupItem value={format.value} id={`format-${format.value}`} />

                <label htmlFor={`format-${format.value}`} className="cursor-pointer text-sm">
                  {format.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </Field>

        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>From</FieldLabel>

            <ExportDatePicker
              value={form.watch('from')}
              onChange={(date) => {
                form.setValue('from', date, {
                  shouldDirty: true,
                  shouldValidate: true,
                });

                const to = form.getValues('to');

                if (date && to && to < date) {
                  form.setValue('to', undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
              placeholder="Month DD, YYYY"
              disabledDate={(date) => date > new Date()}
            />

            {form.formState.errors.from && (
              <FieldDescription className="text-destructive">
                {form.formState.errors.from.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel>To</FieldLabel>

            <ExportDatePicker
              value={form.watch('to')}
              onChange={(date) =>
                form.setValue('to', date, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              placeholder="Month DD, YYYY"
              disabledDate={(date) => date > new Date()}
            />

            {form.formState.errors.to && (
              <FieldDescription className="text-destructive">
                {form.formState.errors.to.message}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel>Fields</FieldLabel>

          <FieldDescription>
            Choose the event fields you want to include in the export.
          </FieldDescription>

          <div className="rounded-md border">
            <ScrollArea className="h-56">
              <div className="space-y-3 p-4">
                <div className="flex items-center gap-3 border-b pb-3">
                  <Checkbox
                    id="select-all-fields"
                    checked={form.watch('fields').length === EVENT_EXPORT_FIELDS.length}
                    onCheckedChange={(checked) => {
                      form.setValue(
                        'fields',
                        checked ? EVENT_EXPORT_FIELDS.map((field) => field.value) : [],
                        { shouldValidate: true }
                      );
                    }}
                  />

                  <label htmlFor="select-all-fields" className="cursor-pointer text-sm font-medium">
                    Select all
                  </label>
                </div>
                {EVENT_EXPORT_FIELDS.map((field) => {
                  const checked = form.watch('fields').includes(field.value);

                  return (
                    <div key={field.value} className="flex items-center gap-3">
                      <Checkbox
                        id={`field-${field.value}`}
                        checked={checked}
                        onCheckedChange={(checked) => {
                          const current = form.getValues('fields');

                          if (checked) {
                            form.setValue('fields', [...current, field.value], {
                              shouldValidate: true,
                            });
                          } else {
                            form.setValue(
                              'fields',
                              current.filter((value) => value !== field.value),
                              { shouldValidate: true }
                            );
                          }
                        }}
                      />

                      <label htmlFor={`field-${field.value}`} className="cursor-pointer text-sm">
                        {field.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {form.formState.errors.fields && (
            <p className="text-sm text-destructive">{form.formState.errors.fields.message}</p>
          )}
        </Field>

        {exportMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            {exportMutation.error ? exportMutation.error.message : 'Failed to export events'}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={exportMutation.isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button type="submit" disabled={exportMutation.isPending} className="cursor-pointer">
            {exportMutation.isPending && <Loader2 className="animate-spin" />}

            {exportMutation.isPending ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
