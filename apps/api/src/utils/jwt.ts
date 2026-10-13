import crypto from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import { serverConfig } from '../config/index.js';
import { AppError } from '../error/index.js';

const ACCESS_SECRET = serverConfig.jwt.accessSecret;
const REFRESH_SECRET = serverConfig.jwt.refreshSecret;

const ACCESS_EXPIRES_IN = serverConfig.jwt.accessExpiry;
const REFRESH_EXPIRES_IN = serverConfig.jwt.refreshExpiry;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured.');
}

interface AccessTokenPayload {
  sub: string;
  email: string;
  type: 'access';
}

interface RefreshTokenPayload {
  sub: string;
  type: 'refresh';
  jti: string;
}

type VerifiedAccessToken = DefaultJwtPayload & AccessTokenPayload;
type VerifiedRefreshToken = DefaultJwtPayload & RefreshTokenPayload;

function generateAccessToken(orgId: string, email: string): string {
  return jwt.sign(
    {
      sub: orgId,
      email,
      type: 'access',
    },
    ACCESS_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: ACCESS_EXPIRES_IN,
      issuer: 'app-api',
      audience: 'app-dashboard',
    }
  );
}

function generateRefreshToken(orgId: string): {
  token: string;
  jti: string;
  expiresAt: Date;
} {
  const jti = crypto.randomUUID();

  const token = jwt.sign(
    {
      sub: orgId,
      type: 'refresh',
      jti,
    },
    REFRESH_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: REFRESH_EXPIRES_IN,
      issuer: 'app-api',
      audience: 'app-dashboard',
    }
  );

  const REFRESH_TOKEN_TTEL_MS = 30 * 24 * 60 * 60 * 1000;
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTEL_MS);

  return { token, jti, expiresAt };
}

function verifyAccessToken(token: string): VerifiedAccessToken {
  const payload = jwt.verify(token, ACCESS_SECRET, {
    issuer: 'app-api',
    audience: 'app-dashboard',
    algorithms: ['HS256'],
  }) as VerifiedAccessToken;

  if (payload.type !== 'access') {
    throw new AppError('Invalid access token.', StatusCodes.UNAUTHORIZED, 'INVALID_ACCESS_TOKEN');
  }

  return payload;
}

function verifyRefreshToken(token: string): VerifiedRefreshToken {
  const payload = jwt.verify(token, REFRESH_SECRET, {
    issuer: 'app-api',
    audience: 'app-dashboard',
    algorithms: ['HS256'],
  }) as VerifiedRefreshToken;

  if (payload.type !== 'refresh') {
    throw new AppError('Invalid refresh token.', StatusCodes.UNAUTHORIZED, 'INVALID_REFRESH_TOKEN');
  }

  return payload;
}

export {
  AccessTokenPayload,
  RefreshTokenPayload,
  VerifiedAccessToken,
  VerifiedRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
