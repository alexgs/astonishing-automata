/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { ActorFactory } from '../../state-machine/actor.factory';
import { ACTIONS } from '../../state-machine/constants';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';
import { InvalidActionException } from '../exceptions/invalid-action.exception';

import { SelectSpeciesCommand } from './select-species.command';

@CommandHandler(SelectSpeciesCommand)
export class SelectSpeciesCommandHandler
  implements ICommandHandler<SelectSpeciesCommand>
{
  constructor(
    private readonly actorFactory: ActorFactory,
    private readonly eventFactory: CharacterBuilderEventFactory,
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async execute(command: SelectSpeciesCommand) {
    const { actor, version } = await this.actorFactory.getActor(
      command.characterId,
    );

    // Check that this is a valid action for the actor
    const action = { type: ACTIONS.SELECT_SPECIES, species: command.species };
    const currentState = actor.getSnapshot();
    if (!currentState.can(action)) {
      throw new InvalidActionException(
        `Cannot select species during step "${currentState.value}".`,
      );
    }

    const event = await this.eventFactory.createSpeciesSelectedEvent({
      characterId: command.characterId,
      species: command.species,
      version,
    });
    await this.eventStoreService.appendEvent(event);

    return { characterId: command.characterId, species: command.species };
  }
}
