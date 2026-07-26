import { OverviewFilters } from '@app/shared';
import { prisma, Prisma } from '../client.js';

class AnalyticsRepository {
  private buildWhere(filters: OverviewFilters): Prisma.EventWhereInput {
    const { orgId, from, to } = filters;

    return {
      orgId,
      ...(from || to
        ? {
            timestamp: {
              ...(from && { gte: from }),
              ...(to && { lt: to }),
            },
          }
        : {}),
    };
  }

  async getTotalEvents(filters: OverviewFilters) {
    return prisma.event.count({
      where: this.buildWhere(filters),
    });
  }

  async getUniqueUsers(filters: OverviewFilters) {
    const { orgId, from, to } = filters;

    const where = Prisma.sql`
            WHERE org_id = ${orgId}
            ${from ? Prisma.sql`AND timestamp >= ${from}` : Prisma.empty}
            ${to ? Prisma.sql`AND timestamp < ${to}` : Prisma.empty}
        `;

    const result = await prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(DISTINCT user_id) AS count
            FROM events ${where}
            AND user_id IS NOT NULL
        `;

    return Number(result[0].count);
  }

  async getAnanonymousUsers(filters: OverviewFilters) {
    const { orgId, from, to } = filters;

    const where = Prisma.sql`
            WHERE org_id = ${orgId}
            ${from ? Prisma.sql`AND timestamp >= ${from}` : Prisma.empty}
            ${to ? Prisma.sql`AND timestamp < ${to}` : Prisma.empty}
        `;

    const result = await prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(DISTINCT anon_id) AS count
            FROM events ${where}
            AND user_id is NULL
        `;

    return Number(result[0].count);
  }

  async getSessionCount(filters: OverviewFilters) {
    const { orgId, from, to } = filters;

    const where = Prisma.sql`
            WHERE org_id = ${orgId}
            ${from ? Prisma.sql`AND timestamp >= ${from}` : Prisma.empty}
            ${to ? Prisma.sql`AND timestamp < ${to}` : Prisma.empty}
        `;

    const result = await prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(DISTINCT session_id) AS count
            FROM events ${where}
        `;

    return Number(result[0].count);
  }
}

export const analyticsRepository = new AnalyticsRepository();
