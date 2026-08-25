import { api } from '@/lib/api';
import type { GetWriteKeysResponse } from './types';

export async function getWriteKeys() {
  return api.get<GetWriteKeysResponse>('/writeKey/write-keys');
}
