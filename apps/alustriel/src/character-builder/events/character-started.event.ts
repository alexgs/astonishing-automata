/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { INITIAL_STEP } from '@automata/state-machine';
import { IEvent } from '@nestjs/cqrs';
import { z } from 'zod';

import { BaseEvent, EventStoreReadModel } from '../../event-store/interfaces';
import { EVENT_TYPES } from '../constants';

export const CharacterStartedEventPayloadSchema = z.object({
  characterId: z.string(),
  nextStep: z.literal(INITIAL_STEP),
});

export type CharacterStartedEventPayload = z.infer<
  typeof CharacterStartedEventPayloadSchema
>;

/**
 * @deprecated
 */
export class CharacterStartedEvent
  implements
    BaseEvent<typeof EVENT_TYPES.STARTED, CharacterStartedEventPayload>,
    IEvent
{
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly data: CharacterStartedEventPayload;
  public readonly streamId: string;
  public readonly type = EVENT_TYPES.STARTED;
  public readonly version: number;

  constructor(row: EventStoreReadModel) {
    this.id = row.id;
    this.createdAt = new Date(row.created_at);
    this.data = row.data as CharacterStartedEventPayload;
    this.streamId = row.stream_id;
    this.version = row.version;
  }
}
