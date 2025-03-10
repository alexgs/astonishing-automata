/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { StartCharacterCreationCommand } from './commands/start-character-creation.command';

@Injectable()
export class CharacterBuilderService {
  constructor(private readonly commandBus: CommandBus) {}

  async startCharacterCreation() {
    return this.commandBus.execute<
      StartCharacterCreationCommand,
      { characterId: string }
    >(new StartCharacterCreationCommand());
  }
}
