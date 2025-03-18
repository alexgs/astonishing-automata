/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { IEvent } from '@nestjs/cqrs';
import { z } from 'zod';

import { BaseEvent, EventStoreReadModel } from '../../event-store/interfaces';
import { EVENT_TYPES } from '../constants';

export const ClassSelectedEventPayloadSchema = z.object({
  characterId: z.string(),
  className: z.string(),
});

export type ClassSelectedEventPayload = z.infer<
  typeof ClassSelectedEventPayloadSchema
>;

export class ClassSelectedEvent
  implements
    BaseEvent<typeof EVENT_TYPES.STEP_CHANGED, ClassSelectedEventPayload>,
    IEvent
{
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly data: ClassSelectedEventPayload;
  public readonly streamId: string;
  public readonly type = EVENT_TYPES.STEP_CHANGED;
  public readonly version: number;

  constructor(row: EventStoreReadModel) {
    this.id = row.id;
    this.createdAt = new Date(row.created_at);
    this.data = row.data as ClassSelectedEventPayload;
    this.streamId = row.stream_id;
    this.version = row.version;
  }
}
