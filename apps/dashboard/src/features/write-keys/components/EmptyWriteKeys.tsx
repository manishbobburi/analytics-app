import { KeyRoundIcon } from 'lucide-react';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export function EmptyWriteKeys() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <KeyRoundIcon />
        </EmptyMedia>

        <EmptyTitle>No Write Keys</EmptyTitle>

        <EmptyDescription className="max-w-xs text-pretty">
          No write keys have been created yet. Create a write key to start sending events to your
          project.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
