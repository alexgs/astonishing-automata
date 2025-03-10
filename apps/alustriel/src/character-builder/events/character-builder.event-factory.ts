/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable, Logger } from '@nestjs/common';

import { EventStoreService } from '../../event-store/event-store.service';
import { EVENT_TYPES, STREAM_TYPES } from '../constants';
import { CharacterContext } from '../state-machine';

@Injectable()
export class CharacterBuilderEventFactory {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  public async createCharacterCreationStartedEvent(
    characterId: string,
    step: string,
    data: CharacterContext,
  ) {
    this.logger.debug('Creating "CharacterCreationStarted" event');
    return this.eventStore.createEvent(
      characterId,
      STREAM_TYPES.CHARACTER,
      EVENT_TYPES.STARTED,
      {
        step,
        data,
      },
    );
  }
}
