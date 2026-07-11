import { BatchEventSchema, EventInput } from '@app/shared';

function validateBatch(data: EventInput[]): EventInput[] {
  return BatchEventSchema.parse(data);
}

export { validateBatch };
