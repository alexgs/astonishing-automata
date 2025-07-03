/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ACTIONS } from '@automata/state-machine';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { ActorFactory } from '../../state-machine/actor.factory';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';
import { InvalidActionException } from '../exceptions/invalid-action.exception';

import { SelectClassCommand } from './select-class.command';

/**
 * @deprecated
 */
@CommandHandler(SelectClassCommand)
export class SelectClassCommandHandler
  implements ICommandHandler<SelectClassCommand>
{
  constructor(
    private readonly actorFactory: ActorFactory,
    private readonly eventFactory: CharacterBuilderEventFactory,
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async execute(command: SelectClassCommand) {
    const { actor, version } = await this.actorFactory.getActor(
      command.characterId,
    );

    // It's more efficient to create the action in each command handler than to centralize it
    const action = { type: ACTIONS.SELECT_CLASS, className: command.className };

    // Check that this is a valid action for the actor
    const currentState = actor.getSnapshot();
    if (!currentState.can(action)) {
      throw new InvalidActionException(
        `Cannot select class during step "${currentState.value}".`,
      );
    }

    const event = await this.eventFactory.createClassSelectedEvent({
      characterId: command.characterId,
      className: command.className,
      version,
    });
    await this.eventStoreService.appendEvent(event);

    return { characterId: command.characterId, className: command.className };
  }
}
