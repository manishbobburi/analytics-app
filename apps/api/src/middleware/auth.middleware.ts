import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/index.js';
import { verifyAccessToken } from '../utils/jwt.js';

function authenticate(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('Authorization');

  if (!authorization) {
    throw new AppError(
      'Authorization header is required.',
      StatusCodes.UNAUTHORIZED,
      'AUTHORIZATION_HEADER_NOT_FOUND'
    );
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError(
      'Invalid authorization header.',
      StatusCodes.UNAUTHORIZED,
      'INVALID_AUTHORIZATION_HEADER'
    );
  }

  try {
    req.user = verifyAccessToken(token);

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(
        'Access token has expired.',
        StatusCodes.UNAUTHORIZED,
        'ACCESS_TOKEN_EXPIRED'
      );
    }

    if (err instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid access token.', StatusCodes.UNAUTHORIZED, 'INVALID_ACCESS_TOKEN');
    }

    throw err;
  }
}

export { authenticate };
