import type { Response } from 'express';
import ExcelJS from 'exceljs';

import type { EventExportField } from '@click-stream/shared';

function escapeCsvValue(value: unknown): string {
  if (value == null) {
    return '';
  }

  const stringValue =
    value instanceof Date
      ? value.toISOString()
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export async function streamCsv(
  res: Response,
  fields: EventExportField[],
  rows: AsyncGenerator<Record<string, unknown>>
) {
  res.write(fields.map((field) => escapeCsvValue(field)).join(',') + '\n');

  for await (const row of rows) {
    const values = fields.map((field) => escapeCsvValue(row[field]));

    res.write(values.join(',') + '\n');
  }
}

export async function streamJson(res: Response, rows: AsyncGenerator<Record<string, unknown>>) {
  res.write('[');

  let first = true;

  for await (const row of rows) {
    if (!first) {
      res.write(',');
    }

    res.write(JSON.stringify(row));

    first = false;
  }

  res.write(']');
}

export async function streamXlsx(
  res: Response,
  fields: EventExportField[],
  rows: AsyncGenerator<Record<string, unknown>>
) {
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });

  const worksheet = workbook.addWorksheet('Events');

  worksheet.addRow(fields).commit();

  for await (const row of rows) {
    worksheet.addRow(fields.map((field) => row[field])).commit();
  }

  await workbook.commit();
}
