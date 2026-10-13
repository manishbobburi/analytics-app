import type { EventExportField } from '@click-stream/shared';

export interface EventExportQuery {
  orgId: string;
  fields: EventExportField[];
  from?: Date;
  to?: Date;
}
