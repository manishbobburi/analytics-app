import { z } from 'zod';

const domainPattern =
  /^(localhost(?::\d{1,5})?|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})(?::\d{1,5})?$/;

export const createWriteKeySchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Label is required')
    .max(100, 'Label must be 100 characters or less'),

  allowedDomain: z
    .string()
    .trim()
    .min(1, 'Allowed domain is required')
    .max(255, 'Allowed domain must be 255 characters or less')
    .refine(
      (value) => domainPattern.test(value),
      'Enter a valid domain, such as example.com or localhost:5174'
    ),
});

export type CreateWriteKeyFormValues = z.infer<typeof createWriteKeySchema>;
