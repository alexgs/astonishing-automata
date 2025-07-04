/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';

import { StartCharacterCommand } from './start-character.command';

@CommandHandler(StartCharacterCommand)
export class StartCharacterHandler
  implements ICommandHandler<StartCharacterCommand>
{
  constructor(
    private readonly eventFactory: CharacterBuilderEventFactory,
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async execute(command: StartCharacterCommand) {
    const characterId = crypto.randomUUID();

    // Create and store the event
    const event = await this.eventFactory.createCharacterStartedEvent(
      command.userId,
      characterId,
    );
    await this.eventStore.appendEvent(event);

    return { characterId };
  }
}
