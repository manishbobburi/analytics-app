import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

export class OrganizationRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.organization);
  }
}

export const organizationRepository = new OrganizationRepository();
