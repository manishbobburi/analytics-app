import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { authService } from '../services/index.js';
import successResponse from '../utils/common/success-response.js';
import { serverConfig } from '../config/index.js';
import type { LoginInput } from '../types/auth.types.js';

async function login(req: Request, res: Response) {
  const payload: LoginInput = {
    email: req.body.email,
    password: req.body.password,
  };

  const { accessToken, refreshToken } = await authService.login(payload);

  res.cookie('refreshToken', refreshToken.token, {
    httpOnly: true,
    secure: serverConfig.isProd,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/auth/refresh',
  });

  return res.status(StatusCodes.OK).json(successResponse({ accessToken }));
}

export { login };
