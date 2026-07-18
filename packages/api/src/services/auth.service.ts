import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import { organizationRepository, refreshTokenRepository } from '@app/db';
import { AppError } from '../error/index.js';
import { LoginInput } from '../types/auth.types.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

async function login(payload: LoginInput) {
  const organization = await organizationRepository.findOrganizationByEmail(payload.email);

  if (!organization) {
    throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, organization.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials.', StatusCodes.UNAUTHORIZED, 'INVALID_CREDENTIALS');
  }

  const accessToken = generateAccessToken(organization.id, organization.email);

  const refreshToken = generateRefreshToken(organization.id);

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken.token).digest('hex');

  await refreshTokenRepository.create({
    orgId: organization.id,
    jti: refreshToken.jti,
    tokenHash: refreshTokenHash,
    expiresAt: refreshToken.expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export { login };
