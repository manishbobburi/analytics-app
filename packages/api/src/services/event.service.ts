import { eventRepository } from '@app/db';
import { EventFilters, GetEventSchema } from '@app/shared';
import { AppError } from '../error/index.js';
import { StatusCodes } from 'http-status-codes';

async function getEvents(orgId: string, reqQuery: unknown) {
  const result = GetEventSchema.safeParse(reqQuery);

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

  const query = result.data;

  const from = query.from ? new Date(query.from) : undefined;
  const to = query.to ? new Date(query.to) : undefined;

  if (to) {
    to.setUTCDate(to.getUTCDate() + 1);
    to.setUTCHours(0, 0, 0, 0);
  }

  const filters: EventFilters = {
    orgId,
    skip: (query.page - 1) * query.limit,
    take: query.limit,
    sort: query.sort,
    event: query.event,
    userId: query.userId,
    anonId: query.anonId,
    sessionId: query.sessionId,
    browserName: query.browserName,
    osName: query.osName,
    deviceType: query.deviceType,
    language: query.language,
    timezone: query.timezone,
    pagePath: query.pagePath,
    from,
    to,
  };

  const [events, total] = await Promise.all([
    eventRepository.findEvents(filters),
    eventRepository.countEvents(filters),
  ]);

  return {
    events,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
      hasNext: query.page * query.limit < total,
    },
  };
}

export { getEvents };
