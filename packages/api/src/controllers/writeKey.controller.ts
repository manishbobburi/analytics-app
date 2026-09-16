import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { WriteKeyIdSchema } from '@click-stream/shared';
import { writeKeyService } from '../services/index.js';
import { CreateWriteKeyDto } from '../types/index.js';
import { AppError } from '../error/index.js';
import successResponse from '../utils/common/success-response.js';

async function createWriteKey(req: Request, res: Response) {
  const { label, allowedDomains } = req.body;
  const user = req.user!;
  const orgId = user.sub;

  const payload: CreateWriteKeyDto = {
    orgId,
    label,
    allowedDomains,
  };

  const writeKey = await writeKeyService.createWriteKey(payload);

  return res.status(StatusCodes.CREATED).json(
    successResponse({
      writeKey,
    })
  );
}

async function listWriteKeys(req: Request, res: Response) {
  const user = req.user!;
  const orgId = user.sub;

  const writeKeys = await writeKeyService.listWriteKeys(orgId);

  return res.status(StatusCodes.OK).json(
    successResponse({
      writeKeys,
    })
  );
}

async function revokeWriteKey(req: Request, res: Response) {
  const user = req.user!;
  const orgId = user.sub;

  const parsed = WriteKeyIdSchema.safeParse(req.params.writeKeyId);

  if (!parsed.success) {
    throw new AppError('Invalid write key ID', StatusCodes.BAD_REQUEST, 'INVALID_WRITE_KEY_ID');
  }

  await writeKeyService.revokeWriteKey(orgId, parsed.data);

  return res.status(StatusCodes.OK).json(successResponse({}));
}

export { createWriteKey, listWriteKeys, revokeWriteKey };
