/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Injectable, Logger } from '@nestjs/common';

import { EventStoreService } from '../../event-store/event-store.service';
import { EVENT_TYPES, STREAM_TYPES } from '../constants';

import { CharacterPatchedEventPayload } from './character-patched.event';
import { CharacterStartedEventPayload } from './character-started.event';

export interface CreateCharacterPatchedEventArgs {
  characterId: string;
  data: Record<string, unknown>;
  isValid: boolean;
  version: number;
}

@Injectable()
export class CharacterBuilderEventFactory {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  public async createCharacterPatchedEvent(
    args: CreateCharacterPatchedEventArgs,
  ) {
    const payload: CharacterPatchedEventPayload = {
      characterId: args.characterId,
      data: args.data,
      isValid: args.isValid,
    };

    return this.eventStore.createEventWriteModel({
      data: payload,
      eventType: EVENT_TYPES.PATCHED,
      streamId: args.characterId,
      streamType: STREAM_TYPES.CHARACTER,
      expectedVersion: args.version,
    });
  }

  public async createCharacterStartedEvent(
    userId: string,
    characterId: string,
  ) {
    const payload: CharacterStartedEventPayload = {
      characterId,
      userId,
    };

    return this.eventStore.createEventWriteModel({
      data: payload,
      eventType: EVENT_TYPES.STARTED,
      streamId: characterId,
      streamType: STREAM_TYPES.CHARACTER,
      expectedVersion: 0, // This should be the first event in the stream
    });
  }
}
