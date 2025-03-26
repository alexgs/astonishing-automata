/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { StepName } from '@automata/state-machine';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ChangeStepCommand } from './commands/change-step.command';
import { SelectClassCommand } from './commands/select-class.command';
import { SelectSpeciesCommand } from './commands/select-species.command';
import { StartCharacterCreationCommand } from './commands/start-character-creation.command';
import { ChangeStepDto } from './dto/change-step.dto';
import { SelectClassDto } from './dto/select-class.dto';
import { SelectSpeciesDto } from './dto/select-species.dto';

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

  async selectClass(selectClassDto: SelectClassDto) {
    return this.commandBus.execute<
      SelectClassCommand,
      { characterId: string; className: string }
    >(
      new SelectClassCommand(
        selectClassDto.characterId,
        selectClassDto.className,
      ),
    );
  }

  async selectSpecies(selectSpeciesDto: SelectSpeciesDto) {
    return this.commandBus.execute<
      SelectSpeciesCommand,
      { characterId: string; species: string }
    >(
      new SelectSpeciesCommand(
        selectSpeciesDto.characterId,
        selectSpeciesDto.species,
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
