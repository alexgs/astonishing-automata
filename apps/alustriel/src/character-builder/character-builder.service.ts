/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { PatchCharacterCommand } from './commands/patch-character.command';
import { StartCharacterCommand } from './commands/start-character.command';
import { PatchCharacterDto } from './dto/patch-character.dto';

@Injectable()
export class CharacterBuilderService {
  constructor(private readonly commandBus: CommandBus) {}

  async patchCharacter(patchCharacterDto: PatchCharacterDto) {
    return this.commandBus.execute<
      PatchCharacterCommand,
      { characterId: string; data: unknown; isValid: boolean }
    >(
      new PatchCharacterCommand(
        patchCharacterDto.characterId,
        patchCharacterDto.data,
      ),
    );
  }

  async startCharacterCreation(userId: string) {
    return this.commandBus.execute<
      StartCharacterCommand,
      { characterId: string }
    >(new StartCharacterCommand(userId));
  }
}
