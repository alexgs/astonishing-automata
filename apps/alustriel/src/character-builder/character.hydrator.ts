/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Injectable, Logger } from '@nestjs/common';
import merge from 'lodash.merge';

import { EventStoreService } from '../event-store/event-store.service';
import { EventStoreReadModel } from '../event-store/interfaces';

import { EVENT_TYPES } from './constants';

interface GetCharacterReturnType {
  characterId: string;
  data: Record<string, unknown>;
  version: number;
}

@Injectable()
export class CharacterHydrator {
  constructor(
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async getCharacter(characterId: string): Promise<GetCharacterReturnType> {
    // Load past events
    const pastEvents =
      await this.eventStoreService.getEventsByStreamId(characterId);

    // No events? This should never happen
    if (pastEvents.length === 0) {
      const message = 'No past events found! This should never happen!';
      this.logger.error(message, CharacterHydrator.name);
      throw new Error(`[${CharacterHydrator.name}] ${message}`);
    }

    // Illegal start event? This should never happen
    if (pastEvents.length === 1 && pastEvents[0].type !== EVENT_TYPES.STARTED) {
      const message = `Illegal start event found in stream ${characterId}`;
      this.logger.error(message, CharacterHydrator.name);
      throw new Error(`[${CharacterHydrator.name}] ${message}`);
    }

    return this.hydrateCharacter(pastEvents);
  }

  hydrateCharacter(pastEvents: EventStoreReadModel[]): GetCharacterReturnType {
    if (pastEvents.length === 0) {
      const message = 'No past events found';
      this.logger.error(message, CharacterHydrator.name);
      throw new Error(`[${CharacterHydrator.name}] ${message}`);
    }

    // Fresh start
    if (pastEvents.length === 1 && pastEvents[0].type === EVENT_TYPES.STARTED) {
      return {
        characterId: pastEvents[0].stream_id,
        data: {},
        version: 1,
      };
    }

    // Rehydrate from past events
    let data: Record<string, unknown> = {};
    let version = 0;
    for (const event of pastEvents) {
      if (event.type === EVENT_TYPES.PATCHED) {
        data = merge(data, event.data as Record<string, unknown>);
        version = event.version;
      }
    }

    return {
      data,
      version,
      characterId: pastEvents[0].stream_id,
    };
  }
}
