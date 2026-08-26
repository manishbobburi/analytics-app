import { api } from '@/lib/api';
import type { GetWriteKeysResponse, CreateWriteKeyInput, CreateWriteKeyResponse } from './types';

export async function getWriteKeys() {
  return api.get<GetWriteKeysResponse>('/writeKey/write-keys');
}

export async function createWriteKey(input: CreateWriteKeyInput): Promise<CreateWriteKeyResponse> {
  return await api.post<CreateWriteKeyResponse>('/writeKey', input);
}
