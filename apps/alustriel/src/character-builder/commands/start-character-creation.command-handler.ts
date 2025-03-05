/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createActor } from 'xstate';
import { StartCharacterCreationCommand } from './start-character-creation.command';
import { characterBuilderStateMachine } from '../character-builder.state-machine';
import { EventStoreService } from '../../event-store/event-store.service';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';

@CommandHandler(StartCharacterCreationCommand)
export class StartCharacterCreationHandler
  implements ICommandHandler<StartCharacterCreationCommand>
{
  constructor(
    private readonly eventFactory: CharacterBuilderEventFactory,
    private readonly eventStore: EventStoreService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_command: StartCharacterCreationCommand) {
    const sessionId = crypto.randomUUID();

    // Initialize the state machine
    const actor = createActor(characterBuilderStateMachine);
    actor.start();
    const step = actor.getSnapshot().value; // Get state name
    const data = actor.getSnapshot().context; // Get initial context

    // Create and store the event
    const event = await this.eventFactory.createCharacterCreationStartedEvent(
      sessionId,
      step,
      data,
    );
    await this.eventStore.appendEvent(event);

    return { sessionId };
  }
}
