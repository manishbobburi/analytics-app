import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useLogin } from '../hooks';
import { useAuth } from '../auth-provider';

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),

  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginLocationState = {
  from?: Location;
};

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useLogin();
  const { setAuthenticated } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await loginMutation.mutateAsync(values);

    setAuthenticated();

    const from = (location.state as LoginLocationState | null)?.from;

    navigate(from ?? '/', {
      replace: true,
    });
  }

  const serverError = loginMutation.error instanceof Error ? loginMutation.error.message : null;

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            autoComplete="email"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register('email')}
          />

          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>

            {/* <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a> */}
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register('password')}
          />

          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </Field>

        {serverError && (
          <FieldDescription role="alert" className="text-destructive">
            {serverError}
          </FieldDescription>
        )}

        <Field>
          <Button type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className="animate-spin" />}

            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </Field>

        <FieldSeparator />
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
