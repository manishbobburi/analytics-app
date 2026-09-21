import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ExportEventsForm } from './ExportEventsForm';

interface ExportEventsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportEventsDialog({ open, onOpenChange }: ExportEventsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export events</DialogTitle>
        </DialogHeader>

        <ExportEventsForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
