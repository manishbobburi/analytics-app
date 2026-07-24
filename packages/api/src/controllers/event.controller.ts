import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ingestionService } from '../services/index.js';
import { AppError } from '../error/index.js';

async function ingestEvents(req: Request, res: Response) {
  const writeKey = req.body.write_key;
  const origin = req.headers.origin!;

  if (!writeKey) {
    throw new AppError('Write key is missing.', StatusCodes.BAD_REQUEST, 'WRITE_KEY_NOT_FOUND');
  }

  await ingestionService.ingest(writeKey, origin, req.body.batch);

  return res.status(StatusCodes.OK).send('OK');
}

export { ingestEvents };
