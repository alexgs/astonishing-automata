/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { characterBuilderMachine } from '@automata/state-machine';
import { Injectable, Logger } from '@nestjs/common';
import { createActor, Actor } from 'xstate';

import { EVENT_TYPES } from '../character-builder/constants';
import { EventStoreService } from '../event-store/event-store.service';
import { EventStoreReadModel } from '../event-store/interfaces';

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
      const message = 'No past events found! This should never happen!';
      this.logger.error(message, ActorFactory.name);
      throw new Error(`[${ActorFactory.name}] ${message}`);
    }

    if (pastEvents.length === 1 && pastEvents[0].type !== EVENT_TYPES.STARTED) {
      const message = `Illegal start event found in stream ${characterId}`;
      this.logger.error(message, ActorFactory.name);
      throw new Error(`[${ActorFactory.name}] ${message}`);
    }

    return this.hydrateActor(pastEvents);
  }

  hydrateActor(pastEvents: EventStoreReadModel[]): GetActorReturnType {
    if (pastEvents.length === 0) {
      const message = 'No past events found';
      this.logger.error(message, ActorFactory.name);
      throw new Error(`[${ActorFactory.name}] ${message}`);
    }

    // Fresh start
    if (pastEvents.length === 1 && pastEvents[0].type === EVENT_TYPES.STARTED) {
      const actor = createActor(characterBuilderMachine);
      actor.start();
      return { actor, version: 1 };
    }
    if (pastEvents.length === 1) {
      const message = 'Illegal start event';
      this.logger.error(message, ActorFactory.name);
      throw new Error(`[${ActorFactory.name}] ${message}`);
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
