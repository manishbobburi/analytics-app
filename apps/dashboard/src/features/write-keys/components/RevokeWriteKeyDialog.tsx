import { AlertTriangleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

import { useRevokeWriteKey } from '../hooks';

interface RevokeWriteKeyDialogProps {
  writeKeyId: string;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RevokeWriteKeyDialog({
  writeKeyId,
  label,
  open,
  onOpenChange,
}: RevokeWriteKeyDialogProps) {
  const { isPending, mutate } = useRevokeWriteKey();

  const handleRevoke = () => {
    mutate(writeKeyId, {
      onSuccess: () => {
        onOpenChange(false);

        toast.add({
          type: 'success',
          description: 'Write key has been revoked successfully.',
        });
      },

      onError: (_error) => {
        onOpenChange(false);

        toast.add({
          type: 'error',
          description: 'Failed to revoke write key.',
        });
      },
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) {
      return;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg border bg-muted/40">
            <AlertTriangleIcon className="size-4" />
          </div>

          <DialogTitle>Revoke write key?</DialogTitle>

          <DialogDescription className="space-y-2">
            <span className="block">
              You are about to revoke <span className="font-medium text-foreground">{label}</span>.
            </span>

            <span className="block">
              This action cannot be undone. Once revoked, this key can no longer be used to ingest
              events. Events ingested with this key after revocation will be rejected.
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleRevoke} disabled={isPending}>
            {isPending ? 'Revoking...' : 'Revoke'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
