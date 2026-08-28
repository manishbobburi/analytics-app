import { api } from '@/lib/api';
import type { GetWriteKeysResponse, CreateWriteKeyInput, CreateWriteKeyResponse } from './types';

export async function getWriteKeys() {
  return api.get<GetWriteKeysResponse>('/writeKey/write-keys');
}

export async function createWriteKey(input: CreateWriteKeyInput): Promise<CreateWriteKeyResponse> {
  return api.post<CreateWriteKeyResponse>('/writeKey', input);
}

export async function revokeWriteKey(writeKeyId: string) {
  return api.post<{}>(`/writeKey/${writeKeyId}/revoke`);
}
