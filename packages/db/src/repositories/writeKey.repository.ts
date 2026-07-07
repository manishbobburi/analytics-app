import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

class WriteKeyRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.writeKey);
  }
}

export const writeKeyRepository = new WriteKeyRepository();
