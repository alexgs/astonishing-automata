/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { IEvent } from '@nestjs/cqrs';

import { BaseEvent, EventStoreReadModel } from '../../event-store/interfaces';
import { StepName } from '../../state-machine/types';
import { EVENT_TYPES } from '../constants';

export interface StepChangedEventPayload {
  characterId: string;
  nextStep: StepName;
  previousStep: StepName;
}

export class StepChangedEvent
  implements
    BaseEvent<typeof EVENT_TYPES.STEP_CHANGED, StepChangedEventPayload>,
    IEvent
{
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly data: StepChangedEventPayload;
  public readonly streamId: string;
  public readonly type = EVENT_TYPES.STEP_CHANGED;
  public readonly version: number;

  constructor(row: EventStoreReadModel) {
    this.id = row.id;
    this.createdAt = new Date(row.created_at);
    this.data = row.data as StepChangedEventPayload;
    this.streamId = row.stream_id;
    this.version = row.version;
  }
}
