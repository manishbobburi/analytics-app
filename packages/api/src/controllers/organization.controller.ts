import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SignupSchema } from '@app/shared';
import successResponse from '../utils/common/success-response.js';
import { AppError } from '../error/index.js';
import * as organizationService from '../services/organization.service.js';

async function createOrganization(req: Request, res: Response) {
  const payload = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const result = SignupSchema.safeParse(payload);

  if (!result.success) {
    throw new AppError(
      'Invalid query parameters',
      StatusCodes.BAD_REQUEST,
      'INVALID_QUERY',
      result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
    );
  }

  const record = await organizationService.createOrganization(result.data);

  return res.status(StatusCodes.OK).json(successResponse(record));
}

export { createOrganization };
