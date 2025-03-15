/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable, Logger } from '@nestjs/common';

import { EventStoreService } from '../../event-store/event-store.service';
import { INITIAL_STEP } from '../../state-machine/constants';
import { StepName } from '../../state-machine/types';
import { EVENT_TYPES, STREAM_TYPES } from '../constants';

import { CharacterStartedEvent } from './character-started.event';
import { StepChangedEvent } from './step-changed.event';

@Injectable()
export class CharacterBuilderEventFactory {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  public async createCharacterStartedEvent(characterId: string) {
    const payload: CharacterStartedEvent = {
      characterId,
      nextStep: INITIAL_STEP,
    };

    return this.eventStore.createEvent(
      characterId,
      STREAM_TYPES.CHARACTER,
      EVENT_TYPES.STARTED,
      { ...payload },
    );
  }

  public async createStepChangedEvent(
    characterId: string,
    nextStep: StepName,
    previousStep: StepName,
  ) {
    const payload: StepChangedEvent = {
      characterId,
      nextStep,
      previousStep,
    };

    return this.eventStore.createEvent(
      characterId,
      STREAM_TYPES.CHARACTER,
      EVENT_TYPES.STEP_CHANGED,
      { ...payload },
    );
  }
}
