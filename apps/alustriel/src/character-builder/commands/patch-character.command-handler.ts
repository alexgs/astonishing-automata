/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { SavageWorlds } from '@automata/grimoire';
import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { CharacterHydrator } from '../character.hydrator';
import { CharacterBuilderEventFactory } from '../events/character-builder.event-factory';
import { validatePatch } from '../validate-patch';

import { PatchCharacterCommand } from './patch-character.command';

@CommandHandler(PatchCharacterCommand)
export class PatchCharacterCommandHandler
  implements ICommandHandler<PatchCharacterCommand>
{
  constructor(
    private readonly characterHydrator: CharacterHydrator,
    private readonly eventFactory: CharacterBuilderEventFactory,
    private readonly eventStore: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async execute(command: PatchCharacterCommand) {
    const character = await this.characterHydrator.getCharacter(
      command.characterId,
    );

    const { isValid } = validatePatch(
      SavageWorlds,
      character.data,
      command.data,
    );

    const event = await this.eventFactory.createCharacterPatchedEvent({
      characterId: command.characterId,
      data: command.data,
      isValid,
      version: character.version,
    });

    await this.eventStore.appendEvent(event);

    return { characterId: command.characterId, data: command.data, isValid };
  }
}
