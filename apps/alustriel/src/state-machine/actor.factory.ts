/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable, Logger } from '@nestjs/common';
import { createActor, Actor } from 'xstate';

import { EventStoreService } from '../event-store/event-store.service';

import { CharacterContext } from './interfaces';
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
    if (pastEvents.length === 0) {
      const actor = createActor(characterBuilderMachine);
      actor.start();
      return actor;
    }

    // Rehydrate the actor with past events, getting the step and data
    let step = characterBuilderMachine.definition.initial.source.id;
    this.logger.debug(`Initial step: ${step}`);
    let data: CharacterContext = {};
    for (const event of pastEvents) {
      // TODO Use constants and types
      if (event.type === 'STATE_TRANSITION') {
        step = event.toState;
      } else {
        data = this.applyEventToContext(data, event);
      }
    }

    // Resolve the state of the machine based on the rehydrated step and data
    const resolvedState = characterBuilderMachine.resolveState({
      value: step,
      context: data,
    });

    // Restore the actor from the resolved state
    const actor = createActor(characterBuilderMachine, {
      snapshot: resolvedState,
    });

    actor.start();
    return actor;
  }
}
