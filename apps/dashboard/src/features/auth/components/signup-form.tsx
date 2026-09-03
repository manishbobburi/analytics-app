import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

import { useSignup } from '../hooks';

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Organization name should be atleast 1 character'),
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
  const navigate = useNavigate();

  const signupMutation = useSignup();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignupFormValues) {
    try {
      await signupMutation.mutateAsync(values);

      toast.add({
        type: 'success',
        title: 'Account created successfully',
        description: 'You can now log in with your credentials.',
      });

      navigate('/login', { replace: true });
    } catch {}
  }

  const serverError = signupMutation.error instanceof Error ? signupMutation.error.message : null;

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Organization Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Example Inc."
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name', {
              onChange: () => {
                if (signupMutation.isError) {
                  signupMutation.reset();
                }
              },
            })}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register('email', {
              onChange: () => {
                if (signupMutation.isError) {
                  signupMutation.reset();
                }
              },
            })}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register('password', {
              onChange: () => {
                if (signupMutation.isError) {
                  signupMutation.reset();
                }
              },
            })}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </Field>

        {serverError && (
          <Alert role="alert">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <Field>
          <Button type="submit" disabled={signupMutation.isPending}>
            {signupMutation.isPending && <Loader2 className=" animate-spin" />}

            {signupMutation.isPending ? 'Creating...' : 'Create Account'}
          </Button>
        </Field>

        <FieldSeparator />
        <Field>
          <FieldDescription className="text-center">
            Already have an account?{' '}
            <Link to="/login" className="underline underline-offset-4">
              Login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
