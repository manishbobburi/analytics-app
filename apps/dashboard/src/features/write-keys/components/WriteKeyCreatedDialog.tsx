import { useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface WriteKeyCreatedDialogProps {
  open: boolean;
  writeKey: string;
  onClose: () => void;
}

export function WriteKeyCreatedDialog({ open, writeKey, onClose }: WriteKeyCreatedDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(writeKey);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="mt-2 font-semibold">Write key created</DialogTitle>

          <DialogDescription>
            Copy this key now. You will not be able to view it again.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input value={writeKey} readOnly className="font-mono text-xs" aria-label="Write key" />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => void handleCopy()}
            aria-label={copied ? 'Write key copied' : 'Copy write key'}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
