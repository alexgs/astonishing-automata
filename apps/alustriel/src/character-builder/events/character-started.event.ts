/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { IEvent } from '@nestjs/cqrs';

import { BaseEvent, EventStoreReadModel } from '../../event-store/interfaces';
import { INITIAL_STEP } from '../../state-machine/constants';
import { EVENT_TYPES } from '../constants';

export interface CharacterStartedEventPayload {
  characterId: string;
  nextStep: typeof INITIAL_STEP;
}

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
