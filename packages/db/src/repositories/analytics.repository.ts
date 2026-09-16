import {
  OverviewFilters,
  EventTrendQuery,
  TrendInterval,
  BreakdownQuery,
  TopEventsQuery,
  TopEventRecord,
  TopPagesQuery,
  TopPageRecord,
} from '@click-stream/shared';
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

  private breakdownColumns = {
    device: 'device_type',
    os: 'os_name',
    browser: 'browser_name',
    language: 'language',
    referrer: 'referrer',
  } as const;

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

  async getBreakdown(query: BreakdownQuery) {
    const { orgId, from, to, dimension } = query;

    const column = Prisma.raw(this.breakdownColumns[dimension]);

    return prisma.$queryRaw<
      {
        label: string;
        count: bigint;
      }[]
    >(Prisma.sql`
      SELECT ${column} AS label, COUNT(*) as count FROM events 
      WHERE org_id = ${orgId} AND timestamp >= ${from} AND timestamp < ${to} GROUP BY ${column} ORDER BY count DESC
    `);
  }

  async getTopEvents(query: TopEventsQuery) {
    const { orgId, from, to, k } = query;

    const where = Prisma.sql`
      WHERE org_id = ${orgId}
      ${from ? Prisma.sql`AND timestamp >= ${from}` : Prisma.empty}
      ${to ? Prisma.sql`AND timestamp < ${to}` : Prisma.empty}
    `;

    return await prisma.$queryRaw<TopEventRecord[]>(Prisma.sql`
      SELECT event, COUNT(*) as count FROM events ${where}
      GROUP BY event ORDER BY COUNT(*) DESC, event ASC LIMIT ${k}
    `);
  }

  async getTopPages(query: TopPagesQuery) {
    const { orgId, from, to, k } = query;

    const where = Prisma.sql`
      WHERE org_id = ${orgId}
      ${from ? Prisma.sql`AND timestamp >= ${from}` : Prisma.empty}
      ${to ? Prisma.sql`AND timestamp < ${to}` : Prisma.empty}
    `;

    return await prisma.$queryRaw<TopPageRecord[]>(Prisma.sql`
      SELECT page_path as page, COUNT(*) as count FROM events ${where}
      AND page_path IS NOT NULL AND page_path <> '' GROUP BY page_path ORDER BY COUNT(*) DESC, page_path ASC LIMIT ${k}
    `);
  }

  async getTotalPageViews(query: TopPagesQuery) {
    const where = this.buildWhere(query);

    return prisma.event.count({
      where: {
        ...where,
        pagePath: {
          not: null,
        },
      },
    });
  }
}

export const analyticsRepository = new AnalyticsRepository();
