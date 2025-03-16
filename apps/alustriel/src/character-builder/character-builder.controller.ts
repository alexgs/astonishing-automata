/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';

import { CharacterBuilderService } from './character-builder.service';
import { ChangeStepDto } from './dto/change-step.dto';
import { SelectSpeciesDto } from './dto/select-species.dto';
import { InvalidStateTransitionException } from './exceptions/invalid-state-transition.exception';

@Controller({ path: 'character-builder', version: '1' })
export class CharacterBuilderController {
  constructor(
    private readonly characterBuilderService: CharacterBuilderService,
    private readonly logger: Logger,
  ) {}

  @Post('change-step')
  async changeStep(@Body() changeStepDto: ChangeStepDto) {
    this.logger.debug(
      'Received POST request to /character-builder/change-step',
      CharacterBuilderController.name,
    );
    try {
      const data = await this.characterBuilderService.changeStep(changeStepDto);
      return { data };
    } catch (error) {
      if (error instanceof InvalidStateTransitionException) {
        throw error; // NestJS will automatically return a 409 response
      }
      throw new InternalServerErrorException(); // Generic fallback
    }
  }

  @Post('select-species')
  async selectSpecies(@Body() selectSpeciesDto: SelectSpeciesDto) {
    this.logger.debug(
      'Received POST request to /character-builder/select-species',
      CharacterBuilderController.name,
    );
    const data =
      await this.characterBuilderService.selectSpecies(selectSpeciesDto);
    return { data };
  }

  @Post('start')
  async startCharacterCreation() {
    this.logger.debug(
      'Received POST request to /character-builder/start',
      CharacterBuilderController.name,
    );
    const data = await this.characterBuilderService.startCharacterCreation();
    return { data }; // TODO This should return the step name, too
  }
}
