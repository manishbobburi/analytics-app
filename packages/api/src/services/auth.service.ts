import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { organizationRepository, refreshTokenRepository } from '@click-stream/db';
import { AppError } from '../error/index.js';
import { LoginInput } from '../types/auth.types.js';
import {
  generateAccessToken,
  generateRefreshToken,
  VerifiedRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

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

async function refreshAccessToken(refreshToken: string) {
  let payload: VerifiedRefreshToken;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(
        'Refresh token expired.',
        StatusCodes.UNAUTHORIZED,
        'REFRESH_TOKEN_EXPIRED'
      );
    }

    if (err instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        'Invalid refresh token.',
        StatusCodes.UNAUTHORIZED,
        'INVALID_REFRESH_TOKEN'
      );
    }

    throw err;
  }

  const org = await organizationRepository.findById(payload.sub);
  const refreshTokenRecord = await refreshTokenRepository.findByJti(payload.jti);
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  if (
    !refreshTokenRecord ||
    refreshTokenRecord.revokedAt ||
    refreshTokenRecord.expiresAt <= new Date() ||
    refreshTokenRecord.tokenHash !== tokenHash ||
    refreshTokenRecord.orgId !== payload.sub
  ) {
    throw new AppError('Invalid refresh token.', StatusCodes.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN');
  }

  const newRefreshToken = generateRefreshToken(payload.sub);
  const accessToken = generateAccessToken(payload.sub, org.email);

  await refreshTokenRepository.update(refreshTokenRecord.id, {
    revokedAt: new Date(),
  });

  await refreshTokenRepository.create({
    orgId: payload.sub,
    jti: newRefreshToken.jti,
    tokenHash: crypto.createHash('sha256').update(newRefreshToken.token).digest('hex'),
    expiresAt: newRefreshToken.expiresAt,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

async function logout(token: string) {
  try {
    const payload: VerifiedRefreshToken = verifyRefreshToken(token);
    const refreshTokenRecord = await refreshTokenRepository.findByJti(payload.jti);

    if (!refreshTokenRecord) return;

    await refreshTokenRepository.update(refreshTokenRecord.id, {
      revokedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) return;

    throw err;
  }

  return;
}

export { login, refreshAccessToken, logout };
