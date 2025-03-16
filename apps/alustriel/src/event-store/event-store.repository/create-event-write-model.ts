/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ulid } from 'ulidx';

import {
  CreateEventWriteModelPayload,
  EventStoreWriteModel,
} from '../interfaces';

export async function createEventWriteModel(
  payload: CreateEventWriteModelPayload,
): Promise<EventStoreWriteModel> {
  const now = new Date();
  return {
    id: ulid(now.getTime()),
    createdAt: now,
    data: payload.data,
    expectedVersion: payload.expectedVersion,
    streamId: payload.streamId,
    streamType: payload.streamType,
    type: payload.eventType,
  };
}
