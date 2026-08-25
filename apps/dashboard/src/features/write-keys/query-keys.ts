import type { QueryKey } from '@tanstack/react-query';

export const writeKeysQueryKeys = {
  all: ['write-keys'] as const,
  list: () => [...writeKeysQueryKeys.all, 'list'] as const,
};
