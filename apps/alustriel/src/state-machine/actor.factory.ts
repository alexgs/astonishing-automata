/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable, Logger } from '@nestjs/common';
import { createActor, Actor } from 'xstate';

import { EVENT_TYPES } from '../character-builder/constants';
import { StepChangedEvent } from '../character-builder/events/step-changed.event';
import { EventStoreService } from '../event-store/event-store.service';

import { characterBuilderMachine } from './state-machine';

@Injectable()
export class ActorFactory {
  constructor(
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async getActor(
    characterId: string,
  ): Promise<Actor<typeof characterBuilderMachine>> {
    // Load past events
    const pastEvents =
      await this.eventStoreService.getEventsByStreamId(characterId);

    // No events? Start fresh
    // TODO There will never be zero events, so we should initialize when there's only the start event
    if (pastEvents.length === 0) {
      const actor = createActor(characterBuilderMachine);
      actor.start();
      return actor;
    }

    // Rehydrate the actor with past events, getting the step and data
    let step = characterBuilderMachine.definition.initial.source.id;
    this.logger.debug(`Initial step: ${step}`);
    for (const event of pastEvents) {
      if (event.type === EVENT_TYPES.STEP_CHANGED) {
        const payload = event.data as unknown as StepChangedEvent; // TODO Improve types
        step = payload.step;
      }
    }

    // Resolve the state of the machine based on the rehydrated step and data
    const resolvedState = characterBuilderMachine.resolveState({
      value: step,
      context: {}, // TODO Eventually the restored data will go here
    });

    // Restore the actor from the resolved state
    const actor = createActor(characterBuilderMachine, {
      snapshot: resolvedState,
    });

    actor.start();
    return actor;
  }
}
