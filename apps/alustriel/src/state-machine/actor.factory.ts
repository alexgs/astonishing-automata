/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { characterBuilderMachine } from '@automata/state-machine';
import { Injectable, Logger } from '@nestjs/common';
import { createActor, Actor } from 'xstate';

import { EVENT_TYPES } from '../character-builder/constants';
import { EventStoreService } from '../event-store/event-store.service';

import { createStateMachineEvent } from './create-state-machine-event';

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

    // Rehydrate the actor by replaying past events
    const actor = createActor(characterBuilderMachine);
    actor.start();
    let version = 0;
    for (const rawEvent of pastEvents) {
      const event = createStateMachineEvent(rawEvent);
      actor.send(event);
      version = rawEvent.version;
    }

    return { actor, version };
  }
}
