import { useState } from 'react';
import { MoreVerticalIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { RevokeWriteKeyDialog } from './RevokeWriteKeyDialog';

interface WriteKeyActionsProps {
  writeKeyId: string;
  label: string;
  isActive: boolean;
}

export function WriteKeyActions({ writeKeyId, label, isActive }: WriteKeyActionsProps) {
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="xs" aria-label={`Actions for ${label}`} />}
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRevokeDialogOpen(true)}>Revoke</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RevokeWriteKeyDialog
        writeKeyId={writeKeyId}
        label={label}
        open={revokeDialogOpen}
        onOpenChange={setRevokeDialogOpen}
      />
    </>
  );
}
