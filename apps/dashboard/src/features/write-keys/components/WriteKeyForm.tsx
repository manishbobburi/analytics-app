import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useCreateWriteKey } from '../hooks';
import { createWriteKeySchema, type CreateWriteKeyFormValues } from '../writeKeySchemas';

interface WriteKeyFormProps {
  onSuccess: (writeKey: string) => void;
  onCancel: () => void;
}

export function WriteKeyForm({ onSuccess, onCancel }: WriteKeyFormProps) {
  const createMutation = useCreateWriteKey();

  const form = useForm<CreateWriteKeyFormValues>({
    resolver: zodResolver(createWriteKeySchema),
    defaultValues: {
      label: '',
      allowedDomain: '',
    },
  });

  const onSubmit = (values: CreateWriteKeyFormValues) => {
    createMutation.mutate(
      {
        label: values.label,
        allowedDomains: [values.allowedDomain],
      },
      {
        onSuccess: (data) => {
          onSuccess(data.writeKey);
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <Field data-invalid={!!form.formState.errors.label}>
        <FieldLabel htmlFor="write-key-label">Label</FieldLabel>

        <Input
          id="write-key-label"
          placeholder="Production"
          autoComplete="off"
          disabled={createMutation.isPending}
          {...form.register('label')}
        />

        <FieldError>{form.formState.errors.label?.message}</FieldError>
      </Field>

      <Field data-invalid={!!form.formState.errors.allowedDomain}>
        <FieldLabel htmlFor="write-key-domain">Allowed domain</FieldLabel>

        <Input
          id="write-key-domain"
          placeholder="www.example.com"
          autoComplete="off"
          disabled={createMutation.isPending}
          {...form.register('allowedDomain')}
        />

        <FieldDescription>Only events sent from this domain will be accepted.</FieldDescription>

        <FieldError>{form.formState.errors.allowedDomain?.message}</FieldError>
      </Field>

      {createMutation.isError && (
        <p className="text-sm text-muted-foreground">
          Unable to create the write key. Please try again.
        </p>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </DialogFooter>
    </form>
  );
}
