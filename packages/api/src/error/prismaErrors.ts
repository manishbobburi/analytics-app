import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@app/db';
import { AppError } from '../error/appError.js';

type PrismaAdapterError = {
  cause?: {
    originalCode?: string;
    originalMessage?: string;
    kind?: string;
    constraint?: {
      fields?: string[];
    };
  };
};

const handlePrismaValidationError = (_err: Prisma.PrismaClientValidationError): AppError => {
  return new AppError(
    'An internal database error occurred.',
    StatusCodes.INTERNAL_SERVER_ERROR,
    'DATABASE_VALIDATION_ERROR'
  );
};

const handlePrismaInitializationError = (
  _err: Prisma.PrismaClientInitializationError
): AppError => {
  return new AppError(
    'Database service is currently unavailable.',
    StatusCodes.SERVICE_UNAVAILABLE,
    'DATABASE_UNAVAILABLE'
  );
};

const handlePrismaRustPanicError = (_err: Prisma.PrismaClientRustPanicError): AppError => {
  return new AppError(
    'A critical database error occurred.',
    StatusCodes.INTERNAL_SERVER_ERROR,
    'DATABASE_ENGINE_FAILURE'
  );
};

const handlePrismaKnownError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (err.code) {
    case 'P2002': {
      const meta = err.meta as
        | {
            target?: string[];
            driverAdapterError?: PrismaAdapterError;
          }
        | undefined;

      const fields = meta?.driverAdapterError?.cause?.constraint?.fields ?? [];

      const fieldLabel = fields
        .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
        .join(', ');

      return new AppError(
        `${fieldLabel || 'Resource'} already exists.`,
        StatusCodes.CONFLICT,
        'DUPLICATE_RESOURCE',
        {
          fields,
        }
      );
    }

    case 'P2003': {
      return new AppError(
        'Referenced resource does not exist.',
        StatusCodes.BAD_REQUEST,
        'FOREIGN_KEY_CONSTRAINT'
      );
    }

    case 'P2025':
      return new AppError(
        'Requested resource was not found.',
        StatusCodes.NOT_FOUND,
        'RESOURCE_NOT_FOUND'
      );

    case 'P2021':
      return new AppError(
        'Internal database configuration error.',
        StatusCodes.INTERNAL_SERVER_ERROR,
        'DATABASE_SCHEMA_ERROR'
      );

    case 'P2022':
      return new AppError(
        'Internal database configuration error.',
        StatusCodes.INTERNAL_SERVER_ERROR,
        'DATABASE_SCHEMA_ERROR'
      );

    default:
      return new AppError(
        'Database operation failed.',
        StatusCodes.INTERNAL_SERVER_ERROR,
        'DATABASE_ERROR'
      );
  }
};

export {
  handlePrismaValidationError,
  handlePrismaInitializationError,
  handlePrismaRustPanicError,
  handlePrismaKnownError,
};
