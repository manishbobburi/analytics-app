import crypto from 'crypto';
import { writeKeyRepository } from '@app/db';
import { CreateWriteKeyDto } from '../types/index.js';

function generateWriteKey(): string {
  return `wk_${crypto.randomBytes(32).toString('base64url')}`;
}

function hashWriteKey(writeKey: string): string {
  return crypto.createHash('sha256').update(writeKey).digest('hex');
}

async function createWriteKey(payload: CreateWriteKeyDto) {
  const writeKey = generateWriteKey();
  const keyHash = hashWriteKey(writeKey);
  const allowedDomains =
    typeof payload.allowedDomains === 'string'
      ? JSON.parse(payload.allowedDomains)
      : payload.allowedDomains;

  await writeKeyRepository.create({
    ...payload,
    keyHash,
    allowedDomains,
  });

  return writeKey;
}

export { createWriteKey };
