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

export const BatchEventSchema = z.array(EventSchema).min(1);
