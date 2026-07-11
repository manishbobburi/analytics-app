import { NormalizedEvent } from '@app/shared';
import { prisma, Prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

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
}

export const eventRepository = new EventRepository();
