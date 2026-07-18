import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { writeKeyService } from '../services/index.js';
import { CreateWriteKeyDto } from '../types/index.js';
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

export { createWriteKey };
