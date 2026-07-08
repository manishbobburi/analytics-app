import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { writeKeyService } from '../services/index.js';
import { CreateWriteKeyDto } from '../types/index.js';

async function createWriteKey(req: Request, res: Response) {
  const { orgId, label, allowedDomains } = req.body;

  const payload: CreateWriteKeyDto = {
    orgId,
    label,
    allowedDomains,
  };

  const writeKey = await writeKeyService.createWriteKey(payload);

  return res.status(StatusCodes.CREATED).json({
    writeKey,
  });
}

export { createWriteKey };
