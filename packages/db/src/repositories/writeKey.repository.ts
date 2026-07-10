import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

class WriteKeyRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.writeKey);
  }

  async findByHash(keyHash: string) {
    return await prisma.writeKey.findUnique({
      where: {
        keyHash: keyHash,
      },
    });
  }
}

export const writeKeyRepository = new WriteKeyRepository();
