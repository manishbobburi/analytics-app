import { z } from 'zod';

export const OptionalDateRangeSchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  })
  .refine(
    ({ from, to }) => {
      if (from === undefined && to === undefined) {
        return true;
      }

      if (from !== undefined && to !== undefined) {
        return from <= to;
      }

      return false;
    },
    {
      message: "Provide both 'from' and 'to', and ensure 'from' is before or equal to 'to'.",
      path: ['from'],
    }
  );

export const RequiredDateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine(({ from, to }) => from <= to, {
    message: "'from' date must be before or equal to 'to' date",
    path: ['from'],
  });

export const GetOverviewQuerySchema = OptionalDateRangeSchema;

export const EventTrendQuerySchema = RequiredDateRangeSchema.extend({
  interval: z.enum(['hour', 'day', 'week', 'month']),
});

export const BreakdownQuerySchema = RequiredDateRangeSchema.extend({
  dimension: z.enum(['device', 'browser', 'os', 'referrer', 'language']),
});
