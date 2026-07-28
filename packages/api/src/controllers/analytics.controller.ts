import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  OverviewQuery,
  GetOverviewQuerySchema,
  EventTrendQuery,
  EventTrendQuerySchema,
} from '@app/shared';
import { analyticsService } from '../services/index.js';
import { AppError } from '../error/index.js';
import successResponse from '../utils/common/success-response.js';

async function getOverview(req: Request, res: Response) {
  const user = req.user!;
  const orgId = user.sub;

  const result = GetOverviewQuerySchema.safeParse(req.query);

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

  const query: OverviewQuery = {
    from: result.data.from,
    to: result.data.to,
  };

  const overview = await analyticsService.getOverview(orgId, query);

  return res.status(StatusCodes.OK).json(successResponse(overview));
}

async function getEventTrend(req: Request, res: Response) {
  const user = req.user!;
  const orgId = user.sub;

  const result = EventTrendQuerySchema.safeParse(req.query);

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

  const { from, to, interval } = result.data;

  const query: EventTrendQuery = {
    orgId,
    from,
    to,
    interval,
  };

  const trend = await analyticsService.getEventTrend(query);

  return res.status(StatusCodes.OK).json(successResponse(trend));
}

export { getOverview, getEventTrend };
