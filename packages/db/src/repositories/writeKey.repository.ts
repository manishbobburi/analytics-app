import { Prisma, prisma } from '../client.js';
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

  async findWriteKeys(args?: Prisma.WriteKeyFindManyArgs) {
    return await prisma.writeKey.findMany(args);
  }

  async findWriteKeyById(orgId: string, writeKeyId: string) {
    return prisma.writeKey.findFirst({
      where: {
        orgId,
        id: writeKeyId,
      },
    });
  }
}

export const writeKeyRepository = new WriteKeyRepository();
