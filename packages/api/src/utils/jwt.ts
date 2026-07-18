import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { serverConfig } from '../config/index.js';

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

export { AccessTokenPayload, RefreshTokenPayload, generateAccessToken, generateRefreshToken };
