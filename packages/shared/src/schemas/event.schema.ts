import { z } from 'zod';

export const EventSchema = z.object({
  event_id: z.string().min(1),
  event: z.string().min(1),
  anon_id: z.string().min(1),
  session_id: z.string().min(1),
  user_id: z.string().optional(),
  timestamp: z.union([z.number(), z.string(), z.date()]),
  properties: z.record(z.string(), z.unknown()),
  context: z.object({
    page_url: z.url(),
    page_path: z.string(),
    page_title: z.string(),
    referrer: z.string().optional(),
    user_agent: z.string(),
    screen_width: z.number().int().positive(),
    screen_height: z.number().int().positive(),
    language: z.string(),
    timezone: z.string(),
  }),
});

export const GetEventSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    event: z.string().trim().optional(),
    userId: z.string().trim().optional(),
    anonId: z.string().trim().optional(),
    sessionId: z.string().trim().optional(),
    browserName: z.string().trim().optional(),
    osName: z.string().trim().optional(),
    deviceType: z.string().trim().optional(),
    language: z.string().trim().optional(),
    timezone: z.string().trim().optional(),
    pagePath: z.string().trim().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    sort: z.enum(['asc', 'desc']).default('desc'),
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

export const BatchEventSchema = z.array(EventSchema).min(1);
