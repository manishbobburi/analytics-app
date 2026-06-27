import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

class EventRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.event);
  }
}

export const eventRepository = new EventRepository();
