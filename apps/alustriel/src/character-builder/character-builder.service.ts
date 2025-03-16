/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { StepName } from '../state-machine/types';

import { ChangeStepCommand } from './commands/change-step.command';
import { StartCharacterCreationCommand } from './commands/start-character-creation.command';
import { ChangeStepDto } from './dto/change-step.dto';

@Injectable()
export class CharacterBuilderService {
  constructor(private readonly commandBus: CommandBus) {}

  async changeStep(changeStepDto: ChangeStepDto) {
    return this.commandBus.execute<
      ChangeStepCommand,
      { characterId: string; targetStep: StepName }
    >(
      new ChangeStepCommand(
        changeStepDto.characterId,
        changeStepDto.targetStep,
      ),
    );
  }

  async startCharacterCreation() {
    return this.commandBus.execute<
      StartCharacterCreationCommand,
      { characterId: string }
    >(new StartCharacterCreationCommand());
  }
}
