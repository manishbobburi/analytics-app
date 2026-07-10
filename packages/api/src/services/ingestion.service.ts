import { eventRepository } from '@app/db';
import { EventInput } from '../schemas/index.js';
import * as validationService from './validation.service.js';
import * as normalizationService from './normalization.service.js';
import * as writeKeyService from './writeKey.service.js';

async function ingest(writeKey: string, origin: string, events: EventInput[]) {
  const writeKeyRecord = await writeKeyService.validateWriteKey(origin, writeKey);

  const validatedEvents = validationService.validateBatch(events);

  for (const event of validatedEvents) {
    const normalized = normalizationService.normalizeEvent(event);

    await eventRepository.create({
      orgId: writeKeyRecord.orgId,
      ...normalized,
    });
  }

  await writeKeyService.updateLastUsed(writeKeyRecord.id);

  return;
}

export { ingest };
