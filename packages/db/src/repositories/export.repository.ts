import { prisma, Prisma } from '../client.js';
import type { EventExportField } from '@click-stream/shared';

const EXPORT_BATCH_SIZE = 1_000;

const EVENT_EXPORT_DB_FIELDS = {
  eventId: 'eventId',
  event: 'event',
  timestamp: 'timestamp',
  userId: 'userId',
  anonId: 'anonId',
  sessionId: 'sessionId',
  pageUrl: 'pageUrl',
  pagePath: 'pagePath',
  referrer: 'referrer',
  browser: 'browserName',
  os: 'osName',
  device: 'deviceType',
  language: 'language',
  timezone: 'timezone',
  contentId: 'contentId',
  contentType: 'contentType',
  properties: 'properties',
} satisfies Record<EventExportField, keyof Prisma.EventSelect>;

interface FindEventExportBatchParams {
  orgId: string;
  fields: EventExportField[];
  from?: Date;
  to?: Date;
  cursor?: string;
}

export class ExportRepository {
  async findEventExportBatch({ orgId, fields, from, to, cursor }: FindEventExportBatchParams) {
    const select = this.buildEventSelect(fields);

    const rows = await prisma.event.findMany({
      where: {
        orgId,
        ...(from || to
          ? {
              timestamp: {
                ...(from && { gte: from }),
                ...(to && { lte: to }),
              },
            }
          : {}),
      },

      select,

      orderBy: {
        id: 'asc',
      },

      take: EXPORT_BATCH_SIZE,

      ...(cursor
        ? {
            cursor: {
              id: cursor,
            },
            skip: 1,
          }
        : {}),
    });

    const nextCursor =
      rows.length === EXPORT_BATCH_SIZE ? String(rows[rows.length - 1].id) : undefined;

    return {
      rows: rows.map((row) => this.normalizeRow(row, fields)),
      nextCursor,
    };
  }

  private buildEventSelect(fields: EventExportField[]): Prisma.EventSelect {
    const select: Prisma.EventSelect = {
      id: true,
    };

    for (const field of fields) {
      select[EVENT_EXPORT_DB_FIELDS[field]] = true;
    }

    return select;
  }

  private normalizeRow(row: Record<string, unknown>, fields: EventExportField[]) {
    const normalized: Record<string, unknown> = {};

    for (const field of fields) {
      const dbField = EVENT_EXPORT_DB_FIELDS[field];

      normalized[field] = row[dbField];
    }

    return normalized;
  }
}

export const exportRepository = new ExportRepository();
