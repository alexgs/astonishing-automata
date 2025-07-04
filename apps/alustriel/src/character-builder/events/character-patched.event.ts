/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { IEvent } from '@nestjs/cqrs';
import { z } from 'zod';

import { BaseEvent, EventStoreReadModel } from '../../event-store/interfaces';
import { EVENT_TYPES } from '../constants';

export const CharacterPatchedEventPayloadSchema = z.object({
  characterId: z.string(),
  data: z.record(z.unknown()),
  isValid: z.boolean(),
});

export type CharacterPatchedEventPayload = z.infer<
  typeof CharacterPatchedEventPayloadSchema
>;

export class CharacterPatchedEvent
  implements
    BaseEvent<typeof EVENT_TYPES.PATCHED, CharacterPatchedEventPayload>,
    IEvent
{
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly data: CharacterPatchedEventPayload;
  public readonly streamId: string;
  public readonly type = EVENT_TYPES.PATCHED;
  public readonly version: number;

  constructor(row: EventStoreReadModel) {
    this.id = row.id;
    this.createdAt = new Date(row.created_at);
    this.data = row.data as CharacterPatchedEventPayload;
    this.streamId = row.stream_id;
    this.version = row.version;
  }
}
