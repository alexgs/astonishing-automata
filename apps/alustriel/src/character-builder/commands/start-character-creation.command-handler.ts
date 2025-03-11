/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createActor } from 'xstate';

import { EventStoreService } from '../../event-store/event-store.service';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';
import { characterBuilderMachine } from '../state-machine';

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

    // Initialize the state machine
    const actor = createActor(characterBuilderMachine);
    actor.start();
    const step = actor.getSnapshot().value; // Get state name
    const data = actor.getSnapshot().context; // Get initial context

    // Create and store the event
    const event = await this.eventFactory.createCharacterCreationStartedEvent(
      characterId,
      step,
      data,
    );
    await this.eventStore.appendEvent(event);

    return { characterId };
  }
}
