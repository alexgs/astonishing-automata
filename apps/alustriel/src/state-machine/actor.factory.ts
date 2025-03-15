/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable, Logger } from '@nestjs/common';
import { createActor, Actor } from 'xstate';

import { EVENT_TYPES } from '../character-builder/constants';
import { StepChangedEvent } from '../character-builder/events/step-changed.event';
import { EventStoreService } from '../event-store/event-store.service';

import { INITIAL_STEP } from './constants';
import { characterBuilderMachine } from './state-machine';
import { StepName } from './types';

interface GetActorReturnType {
  actor: Actor<typeof characterBuilderMachine>;
  version: number;
}

@Injectable()
export class ActorFactory {
  constructor(
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async getActor(characterId: string): Promise<GetActorReturnType> {
    // Load past events
    const pastEvents =
      await this.eventStoreService.getEventsByStreamId(characterId);

    // No events? This should never happen
    if (pastEvents.length === 0) {
      this.logger.error(
        'No past events found! This should never happen!',
        ActorFactory.name,
      );
      throw new Error(
        `[${ActorFactory.name}] No past events found! This should never happen!`,
      );
    }

    // Fresh start
    if (pastEvents.length === 1 && pastEvents[0].type === EVENT_TYPES.STARTED) {
      const actor = createActor(characterBuilderMachine);
      actor.start();
      return { actor, version: 1 };
    }
    if (pastEvents.length === 1) {
      this.logger.error(
        `Illegal start event found in stream ${characterId}`,
        ActorFactory.name,
      );
      throw new Error(
        `[${ActorFactory.name}] Illegal start event found in stream ${characterId}`,
      );
    }

    // Rehydrate the actor with past events, getting the step and data
    let step: StepName = INITIAL_STEP;
    let version = 0;
    for (const event of pastEvents) {
      version = event.version;
      if (event.type === EVENT_TYPES.STEP_CHANGED) {
        const payload = event.data as unknown as StepChangedEvent; // TODO Improve types
        step = payload.nextStep;
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
    return { actor, version };
  }
}
