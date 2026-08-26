import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { getWriteKeys, createWriteKey } from './api';
import { writeKeysQueryKeys } from './query-keys';
import type { CreateWriteKeyInput } from './types';

export function useWriteKeys() {
  return useQuery({
    queryKey: writeKeysQueryKeys.list(),
    queryFn: getWriteKeys,
  });
}

export function useCreateWriteKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWriteKeyInput) => createWriteKey(input),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: writeKeysQueryKeys.list(),
      });
    },
  });
}
