import { BatchEventSchema, EventInput } from '@click-stream/shared';

function validateBatch(data: EventInput[]): EventInput[] {
  return BatchEventSchema.parse(data);
}

export { validateBatch };
