import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

class ApiKeyRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.apiKey);
  }
}

export const apiKeyRepository = new ApiKeyRepository();
