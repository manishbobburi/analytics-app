import { NormalizedEvent, EventFilters } from '@app/shared';
import { prisma, Prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

const EVENT_LIST_SELECT = {
  id: true,
  eventId: true,
  event: true,
  timestamp: true,
  userId: true,
  anonId: true,
  sessionId: true,
  pageUrl: true,
  pagePath: true,
  browserName: true,
  osName: true,
  deviceType: true,
  properties: true,
} as const;

export const EVENT_DETAILS_SELECT = {
  eventId: true,
  event: true,
  timestamp: true,

  userId: true,
  anonId: true,
  sessionId: true,

  contentId: true,
  contentType: true,

  pageUrl: true,
  pagePath: true,
  referrer: true,

  browserName: true,
  osName: true,
  deviceType: true,

  language: true,
  timezone: true,

  properties: true,
  context: true,
} satisfies Prisma.EventSelect;

class EventRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.event);
  }

  async createMany(normalizedEvents: NormalizedEvent[]) {
    const data = normalizedEvents.map((event) => ({
      ...event,
      properties: event.properties as Prisma.InputJsonValue,
      context: event.context as Prisma.InputJsonValue,
    }));

    return prisma.event.createMany({
      data: data,
      skipDuplicates: true,
    });
  }

  async findEvents(filters: EventFilters) {
    const where = this.buildWhere(filters);
    const { skip, take, sort } = filters;

    return prisma.event.findMany({
      where,
      select: EVENT_LIST_SELECT,
      skip,
      take,
      orderBy: {
        timestamp: sort,
      },
    });
  }

  async countEvents(filters: EventFilters): Promise<number> {
    const where = this.buildWhere(filters);

    return prisma.event.count({
      where,
    });
  }

  async findByEventId(orgId: string, eventId: string) {
    return prisma.event.findUnique({
      where: {
        orgId_eventId: {
          orgId,
          eventId,
        },
      },
      select: EVENT_DETAILS_SELECT,
    });
  }

  private buildWhere(filters: EventFilters): Prisma.EventWhereInput {
    const where: Prisma.EventWhereInput = {
      orgId: filters.orgId,
    };

    if (filters.event) where.event = filters.event;
    if (filters.userId) where.userId = filters.userId;
    if (filters.anonId) where.anonId = filters.anonId;
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.browserName) where.browserName = filters.browserName;
    if (filters.osName) where.osName = filters.osName;
    if (filters.deviceType) where.deviceType = filters.deviceType;
    if (filters.language) where.language = filters.language;
    if (filters.timezone) where.timezone = filters.timezone;
    if (filters.pagePath) where.pagePath = filters.pagePath;
    if (filters.from || filters.to) {
      where.timestamp = {};
      if (filters.from) where.timestamp.gte = filters.from;
      if (filters.to) where.timestamp.lte = filters.to;
    }

    return where;
  }
}

export const eventRepository = new EventRepository();
