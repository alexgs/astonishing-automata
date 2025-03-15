/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';

import { StartCharacterCreationCommand } from './start-character-creation.command';

@CommandHandler(StartCharacterCreationCommand)
export class StartCharacterCreationHandler
  implements ICommandHandler<StartCharacterCreationCommand>
{
  constructor(
    private readonly eventFactory: CharacterBuilderEventFactory,
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_command: StartCharacterCreationCommand) {
    const characterId = crypto.randomUUID();

    // Create and store the event
    const event =
      await this.eventFactory.createCharacterCreationStartedEvent(characterId);
    await this.eventStore.appendEvent(event);

    return { characterId };
  }
}
