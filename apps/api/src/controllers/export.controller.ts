import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EventExportSchema } from '@click-stream/shared';
import { exportService } from '../services/index.js';
import { AppError } from '../error/index.js';
import { streamCsv, streamJson, streamXlsx } from '../utils/export.serializer.js';

export async function exportEvents(req: Request, res: Response) {
  const user = req.user!;
  const orgId = user.sub;

  const parsed = EventExportSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      parsed.error.message,
      StatusCodes.BAD_REQUEST,
      'INVALID_OPTIONS',
      parsed.error
    );
  }

  const { fields, format, from, to } = parsed.data;

  const metadata = exportService.getFileMetadata(format);

  const filename = `events-${new Date().toISOString().slice(0, 10)}.${metadata.extension}`;

  res.setHeader('Content-Type', metadata.contentType);

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const rows = exportService.streamEvents({
    orgId,
    fields,
    from,
    to,
  });

  switch (format) {
    case 'csv':
      await streamCsv(res, fields, rows);
      break;

    case 'json':
      await streamJson(res, rows);
      break;

    case 'xlsx':
      await streamXlsx(res, fields, rows);
      break;
  }

  res.end();
}
