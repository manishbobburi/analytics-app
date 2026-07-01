import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@app/db';
import { ErrorWithCode } from '../types/index.js';
import {
  sendErrorDev,
  sendErrorProd,
  handlePrismaKnownError,
  handlePrismaRustPanicError,
  handlePrismaValidationError,
  handlePrismaInitializationError,
} from '../error/index.js';

const globalErrorHandler = (
  err: ErrorWithCode,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  const isDev = process.env.NODE_ENV === 'development';
  let error = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    error = handlePrismaValidationError(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaKnownError(err);
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    error = handlePrismaInitializationError(err);
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    error = handlePrismaRustPanicError(err);
  }

  if (isDev) {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
