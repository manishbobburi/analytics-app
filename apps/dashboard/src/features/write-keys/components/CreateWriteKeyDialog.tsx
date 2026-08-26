import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { WriteKeyCreatedDialog } from './WriteKeyCreatedDialog';
import { WriteKeyForm } from './WriteKeyForm';

interface CreateWriteKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWriteKeyDialog({ open, onOpenChange }: CreateWriteKeyDialogProps) {
  const [createdWriteKey, setCreatedWriteKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setCreatedWriteKey(null);
    }
  }, [open]);

  const handleCreated = (writeKey: string) => {
    setCreatedWriteKey(writeKey);
  };

  const handleCreatedDialogClose = () => {
    setCreatedWriteKey(null);
    onOpenChange(false);
  };

  if (createdWriteKey) {
    return (
      <WriteKeyCreatedDialog open writeKey={createdWriteKey} onClose={handleCreatedDialogClose} />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create write key</DialogTitle>

          <DialogDescription>
            You can't edit these settings after the key is created.
          </DialogDescription>
        </DialogHeader>

        <WriteKeyForm onSuccess={handleCreated} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
