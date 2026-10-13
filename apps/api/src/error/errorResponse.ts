import { Response } from 'express';
import { AppError } from '../error/index.js';
import { ErrorWithCode } from '../types/index.js';

const sendErrorDev = (err: ErrorWithCode, res: Response): void => {
  res.status(err.statusCode ?? 500).json({
    success: false,
    error: {
      message: err.message,
      code: err.errorCode ?? 'INTERNAL_ERROR',
      details: err.details,
      stack: err.stack,
    },
  });
};

const sendErrorProd = (err: ErrorWithCode, res: Response): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.errorCode,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};

export { sendErrorDev, sendErrorProd };
