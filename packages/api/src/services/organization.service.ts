import * as bcrypt from 'bcrypt';
import { organizationRepository } from '@app/db';

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

export { createOrganization };
