import { useWriteKeys } from '../hooks';
import { EmptyWriteKeys } from './EmptyWriteKeys';
import { WriteKeysTable } from './WriteKeysTable';
import { WriteKeysTableSkeleton } from './WriteKeysTableSkeleton';
import { QueryError } from '@/components/common/QueryError';

export function WriteKeysList() {
  const { data, isPending, isError, refetch } = useWriteKeys();

  if (isPending) {
    return <WriteKeysTableSkeleton />;
  }

  if (isError) {
    return (
      <QueryError
        title="Unable to load write keys"
        description="We couldn't load your write keys."
        onRetry={refetch}
      />
    );
  }

  const writeKeys = data?.writeKeys ?? [];

  if (writeKeys.length === 0) {
    return <EmptyWriteKeys />;
  }

  return <WriteKeysTable writeKeys={writeKeys} />;
}
