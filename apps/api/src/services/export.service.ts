import type { EventExportField, ExportFormat } from '@click-stream/shared';

import { exportRepository } from '@click-stream/db';

interface StreamEventsParams {
  orgId: string;
  fields: EventExportField[];
  from?: Date;
  to?: Date;
}

async function* streamEvents({ orgId, fields, from, to }: StreamEventsParams) {
  let cursor: string | undefined;

  while (true) {
    const result = await exportRepository.findEventExportBatch({
      orgId,
      fields,
      from,
      to,
      cursor,
    });

    for (const row of result.rows) {
      yield row;
    }

    if (!result.nextCursor) {
      break;
    }

    cursor = result.nextCursor;
  }
}

function getFileMetadata(format: ExportFormat) {
  switch (format) {
    case 'csv':
      return {
        contentType: 'text/csv; charset=utf-8',
        extension: 'csv',
      };

    case 'json':
      return {
        contentType: 'application/json; charset=utf-8',
        extension: 'json',
      };

    case 'xlsx':
      return {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
      };
  }
}

export { streamEvents, getFileMetadata };
