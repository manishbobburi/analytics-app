import { eventRepository } from '@click-stream/db';
import { EventInput } from '@click-stream/shared';
import * as validationService from './validation.service.js';
import * as normalizationService from './normalization.service.js';
import * as writeKeyService from './writeKey.service.js';

async function ingest(writeKey: string, origin: string, events: EventInput[]) {
  const writeKeyRecord = await writeKeyService.validateWriteKey(origin, writeKey);

  const validatedEvents = validationService.validateBatch(events);

  const normalizedEvents = normalizationService.normalizeBatch(
    writeKeyRecord.orgId,
    validatedEvents
  );

  await eventRepository.createMany(normalizedEvents);

  await writeKeyService.updateLastUsed(writeKeyRecord.id);

  return;
}

export { ingest };
