import { z } from 'zod';

export const GetOverviewQuerySchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  })
  .refine(
    ({ from, to }) => {
      if (!from || !to) return true;
      return from <= to;
    },
    {
      message: "'from' date must be before or equal to 'to' date",
      path: ['from'],
    }
  );

export const EventTrendQuerySchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
    interval: z.enum(['hour', 'day', 'week', 'month']),
  })
  .refine(({ from, to }) => from <= to, {
    message: "'from' date must be before or equal to 'to' date",
    path: ['from'],
  });
