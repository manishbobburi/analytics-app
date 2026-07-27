import { OverviewFilters, EventTrendQuery, TrendInterval } from '@app/shared';
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
  private getDateTruncExpression(interval: TrendInterval) {
    switch (interval) {
      case 'hour':
        return "'hour'";
      case 'day':
        return "'day'";
      case 'week':
        return "'week'";
      case 'month':
        return "'month'";
      default:
        throw new Error('Invalid interval');
    }
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

  async getEventTrend(query: EventTrendQuery) {
    const { orgId, from, to, interval } = query;

    const groupBy = this.getDateTruncExpression(interval);

    return prisma.$queryRaw<
      {
        period: Date;
        events: bigint;
      }[]
    >(Prisma.sql`
      SELECT DATE_TRUNC(${Prisma.raw(groupBy)}, timestamp) AS period, COUNT(*) AS events FROM events
      WHERE org_id = ${orgId} AND timestamp >= ${from} AND timestamp < ${to} GROUP BY period ORDER BY period ASC
    `);
  }
}

export const analyticsRepository = new AnalyticsRepository();
