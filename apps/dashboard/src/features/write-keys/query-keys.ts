export const writeKeysQueryKeys = {
  all: ['write-keys'] as const,
  list: () => [...writeKeysQueryKeys.all, 'list'] as const,
};
