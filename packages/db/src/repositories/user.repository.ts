import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

class UserRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.user);
  }
}

export const userRepository = new UserRepository();
