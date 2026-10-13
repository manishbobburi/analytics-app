import * as bcrypt from 'bcrypt';
import { organizationRepository, Prisma } from '@click-stream/db';
import { GetOrganizationResponse } from '@click-stream/shared';

async function createOrganization(data: any) {
  const passwordHash = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS));

  const response = await organizationRepository.create({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const { passwordHash: _passwordHash, createdAt: _createdAt, id: _id, ...safeResponse } = response;

  return safeResponse;
}

async function getOrganization(orgId: string): Promise<GetOrganizationResponse> {
  const response: Prisma.OrganizationModel = await organizationRepository.findById(orgId);

  const { passwordHash: _passwordHash, createdAt: _createdAt, id: _id, ...safeResponse } = response;

  return safeResponse;
}

export { createOrganization, getOrganization };
