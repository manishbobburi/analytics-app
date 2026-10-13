import { rateLimit } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../error/index.js';
import { rateLimitConfig } from '../config/index.js';

const rateLimitHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Too many requests', StatusCodes.TOO_MANY_REQUESTS, 'RATE_LIMIT_EXCEEDED'));
};

const { global, login, register, authenticatedApi, mutationApi } = rateLimitConfig;

export const globalLimiter = rateLimit({
  windowMs: global.windowMs,
  limit: global.limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const loginLimiter = rateLimit({
  windowMs: login.windowMs,
  limit: login.limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const registerLimiter = rateLimit({
  windowMs: register.windowMs,
  limit: register.limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const authenticatedLimiter = rateLimit({
  windowMs: authenticatedApi.windowMs,
  limit: authenticatedApi.limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export const mutationLimiter = rateLimit({
  windowMs: mutationApi.windowMs,
  limit: mutationApi.limit,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
});
