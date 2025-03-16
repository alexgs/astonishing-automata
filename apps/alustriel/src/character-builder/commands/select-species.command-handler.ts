/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { ActorFactory } from '../../state-machine/actor.factory';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';

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
    actor.setSpecies(command.species);
  }
}
