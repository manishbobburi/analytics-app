import { useQuery } from '@tanstack/react-query';

import { getWriteKeys } from './api';
import { writeKeysQueryKeys } from './query-keys';

export function useWriteKeys() {
  return useQuery({
    queryKey: writeKeysQueryKeys.list(),
    queryFn: getWriteKeys,
  });
}
