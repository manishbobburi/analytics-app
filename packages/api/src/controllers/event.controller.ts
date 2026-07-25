import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ingestionService, eventService } from '../services/index.js';
import { AppError } from '../error/index.js';
import successResponse from '../utils/common/success-response.js';

async function ingestEvents(req: Request, res: Response) {
  const writeKey = req.body.write_key;
  const origin = req.headers.origin!;

  if (!writeKey) {
    throw new AppError('Write key is missing.', StatusCodes.BAD_REQUEST, 'WRITE_KEY_NOT_FOUND');
  }

  await ingestionService.ingest(writeKey, origin, req.body.batch);

  return res.status(StatusCodes.OK).send('OK');
}

async function getEvents(req: Request, res: Response) {
  const user = req.user!;
  const orgId = user.sub;

  const events = await eventService.getEvents(orgId, req.query);

  return res.status(StatusCodes.OK).json(successResponse(events));
}

export { ingestEvents, getEvents };
