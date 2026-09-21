import { z } from 'zod';
import { EVENT_EXPORT_FIELDS, EXPORT_FORMATS } from '../types/export.js';
import { OptionalDateRangeSchema } from './analytics.schema.js';

const EventExportFieldSchema = z.enum(
  EVENT_EXPORT_FIELDS.map(({ value }) => value) as [
    (typeof EVENT_EXPORT_FIELDS)[number]['value'],
    ...(typeof EVENT_EXPORT_FIELDS)[number]['value'][],
  ]
);
const ExportFormatSchema = z.enum(
  EXPORT_FORMATS.map(({ value }) => value) as [
    (typeof EXPORT_FORMATS)[number]['value'],
    ...(typeof EXPORT_FORMATS)[number]['value'][],
  ]
);

export const EventExportSchema = OptionalDateRangeSchema.extend({
  fields: z
    .array(EventExportFieldSchema)
    .min(1, 'At least one field must be selected')
    .refine((fields) => new Set(fields).size === fields.length, {
      message: 'Duplicate fields are not allowed',
    }),

  format: ExportFormatSchema,
});
