import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().trim().min(1, 'Organization name should be atleast 1 character'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
