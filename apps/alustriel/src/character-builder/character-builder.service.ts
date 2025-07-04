/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { StepName } from '@automata/state-machine';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ChangeStepCommand } from './commands/change-step.command';
import { PatchCharacterCommand } from './commands/patch-character.command';
import { SelectClassCommand } from './commands/select-class.command';
import { SelectSpeciesCommand } from './commands/select-species.command';
import { StartCharacterCommand } from './commands/start-character.command';
import { ChangeStepDto } from './dto/change-step.dto';
import { PatchCharacterDto } from './dto/patch-character.dto';
import { SelectClassDto } from './dto/select-class.dto';
import { SelectSpeciesDto } from './dto/select-species.dto';

@Injectable()
export class CharacterBuilderService {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * @deprecated
   */
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

  async patchCharacter(patchCharacterDto: PatchCharacterDto) {
    return this.commandBus.execute<
      PatchCharacterCommand,
      { characterId: string; data: unknown }
    >(
      new PatchCharacterCommand(
        patchCharacterDto.characterId,
        patchCharacterDto.data,
      ),
    );
  }

  /**
   * @deprecated
   */
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

  /**
   * @deprecated
   */
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

  async startCharacterCreation(userId: string) {
    return this.commandBus.execute<
      StartCharacterCommand,
      { characterId: string }
    >(new StartCharacterCommand(userId));
  }
}
