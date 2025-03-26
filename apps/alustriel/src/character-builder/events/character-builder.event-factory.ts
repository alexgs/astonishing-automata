/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { INITIAL_STEP, StepName } from '@automata/state-machine';
import { Injectable, Logger } from '@nestjs/common';

import { EventStoreService } from '../../event-store/event-store.service';
import { EVENT_TYPES, STREAM_TYPES } from '../constants';

import { CharacterStartedEventPayload } from './character-started.event';
import { ClassSelectedEventPayload } from './class-selected.event';
import { SpeciesSelectedEventPayload } from './species-selected.event';
import { StepChangedEventPayload } from './step-changed.event';

export interface CreateClassSelectedEventArgs {
  characterId: string;
  className: string;
  version: number;
}

export interface CreateSpeciesSelectedEventArgs {
  characterId: string;
  species: string;
  version: number;
}

@Injectable()
export class CharacterBuilderEventFactory {
  constructor(
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  public async createCharacterStartedEvent(characterId: string) {
    const payload: CharacterStartedEventPayload = {
      characterId,
      nextStep: INITIAL_STEP,
    };

    return this.eventStore.createEventWriteModel({
      data: payload,
      eventType: EVENT_TYPES.STARTED,
      streamId: characterId,
      streamType: STREAM_TYPES.CHARACTER,
      expectedVersion: 0, // This should be the first event in the stream
    });
  }

  public createClassSelectedEvent(args: CreateClassSelectedEventArgs) {
    const payload: ClassSelectedEventPayload = {
      characterId: args.characterId,
      className: args.className,
    };

    return this.eventStore.createEventWriteModel({
      data: payload,
      eventType: EVENT_TYPES.CLASS_SELECTED,
      streamId: args.characterId,
      streamType: STREAM_TYPES.CHARACTER,
      expectedVersion: args.version,
    });
  }

  public createSpeciesSelectedEvent(args: CreateSpeciesSelectedEventArgs) {
    const payload: SpeciesSelectedEventPayload = {
      characterId: args.characterId,
      species: args.species,
    };

    return this.eventStore.createEventWriteModel({
      data: payload,
      eventType: EVENT_TYPES.SPECIES_SELECTED,
      streamId: args.characterId,
      streamType: STREAM_TYPES.CHARACTER,
      expectedVersion: args.version,
    });
  }

  public async createStepChangedEvent(
    characterId: string,
    nextStep: StepName,
    previousStep: StepName,
    expectedVersion: number,
  ) {
    const payload: StepChangedEventPayload = {
      characterId,
      nextStep,
      previousStep,
    };

    return this.eventStore.createEventWriteModel({
      data: payload,
      eventType: EVENT_TYPES.STEP_CHANGED,
      expectedVersion,
      streamId: characterId,
      streamType: STREAM_TYPES.CHARACTER,
    });
  }
}
