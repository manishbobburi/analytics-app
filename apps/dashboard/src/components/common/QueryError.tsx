import { AlertCircle, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface QueryErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function QueryError({
  title = 'Unable to load data',
  description = "We're having trouble retrieving this information right now.",
  onRetry,
}: QueryErrorProps) {
  return (
    <Alert>
      <AlertCircle />

      <AlertTitle>{title}</AlertTitle>

      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{description}</span>

        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
