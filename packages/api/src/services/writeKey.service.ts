import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { writeKeyRepository } from '@app/db';
import { CreateWriteKeyDto } from '../types/index.js';
import { AppError } from '../error/index.js';

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

async function validateWriteKey(origin: string, writeKey: string) {
  const keyHash = hashWriteKey(writeKey);
  const record = await writeKeyRepository.findByHash(keyHash);

  if (!record) {
    throw new AppError('Invalid write key.', StatusCodes.UNAUTHORIZED, 'INVALID_WRITE_KEY');
  }

  if (!record.isActive) {
    throw new AppError(
      'This write key has been disabled.',
      StatusCodes.FORBIDDEN,
      'WRITE_KEY_DISABLED'
    );
  }

  if (record.revokedAt) {
    throw new AppError(
      'This write key has been revoked.',
      StatusCodes.FORBIDDEN,
      'WRITE_KEY_REVOKED'
    );
  }

  if (!isAllowedDomain(origin, record.allowedDomains)) {
    throw new AppError(
      'Requests from this origin are not allowed.',
      StatusCodes.FORBIDDEN,
      'ORIGIN_NOT_ALLOWED'
    );
  }

  return record;
}

async function updateLastUsed(writeKeyId: string) {
  await writeKeyRepository.update(writeKeyId, {
    lastUsedAt: new Date(),
  });

  return;
}

function isAllowedDomain(origin: string, allowedDomains: string[]): boolean {
  return allowedDomains.includes(origin);
}

export { createWriteKey, validateWriteKey, updateLastUsed };
