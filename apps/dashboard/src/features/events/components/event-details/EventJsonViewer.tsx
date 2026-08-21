import { useMemo, useState } from 'react';
import { Check, ChevronDown, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EventJsonViewerProps {
  event: unknown;
}

export function EventJsonViewer({ event }: EventJsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson = useMemo(() => JSON.stringify(event, null, 2), [event]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Collapsible>
      <div className="flex items-center justify-between border-y py-4">
        <CollapsibleTrigger className="group flex items-center gap-2 text-sm font-medium">
          <span>Raw event</span>

          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <Button type="button" variant="ghost" size="sm" className="h-8 gap-2" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="size-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      <CollapsibleContent className="pt-3">
        <pre className="max-h-105 overflow-auto rounded-md border bg-muted/30 p-4 text-xs leading-5">
          <code>{formattedJson}</code>
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
