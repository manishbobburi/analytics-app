import { BatchEventSchema, EventInput } from '../schemas/index.js';

function validateBatch(data: EventInput[]): EventInput[] {
  return BatchEventSchema.parse(data);
}

export { validateBatch };
