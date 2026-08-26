export interface WriteKey {
  id: string;
  label: string;
  allowedDomains: string[];
  isActive: boolean;
  revokedAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface GetWriteKeysResponse {
  writeKeys: WriteKey[];
}

export interface CreateWriteKeyInput {
  label: string;
  allowedDomains: string[];
}

export interface CreateWriteKeyResponse {
  writeKey: string;
}

export type WriteKeyStatus = 'active' | 'revoked';
