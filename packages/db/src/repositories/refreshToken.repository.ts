import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

class RefreshTokenRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.refreshToken);
  }

  async findByJti(jti: string) {
    return prisma.refreshToken.findUnique({
      where: { jti },
    });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
