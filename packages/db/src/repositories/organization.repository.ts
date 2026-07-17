import { prisma } from '../client.js';
import { BaseRepository } from './base.repository.js';

export class OrganizationRepository extends BaseRepository<any> {
  constructor() {
    super(prisma.organization);
  }

  async findOrganizationByEmail(email: string) {
    return prisma.organization.findUnique({
      where: { email },
    });
  }
}

export const organizationRepository = new OrganizationRepository();
