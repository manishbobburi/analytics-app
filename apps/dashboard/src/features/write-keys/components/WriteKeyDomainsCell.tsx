import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface WriteKeyDomainsCellProps {
  domains: string[];
}

export function WriteKeyDomainsCell({ domains }: WriteKeyDomainsCellProps) {
  if (domains.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const [firstDomain, ...remainingDomains] = domains;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="max-w-55 truncate font-mono text-xs text-foreground" title={firstDomain}>
        {firstDomain}
      </span>

      {remainingDomains.length > 0 && (
        <Tooltip>
          <TooltipTrigger className="shrink-0 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer">
            +{remainingDomains.length}
          </TooltipTrigger>

          <TooltipContent side="top" align="start" className="max-w-sm">
            <div className="flex max-h-60 flex-col gap-1.5 overflow-y-auto">
              {domains.map((domain) => (
                <span key={domain} className="font-mono text-xs">
                  {domain}
                </span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
