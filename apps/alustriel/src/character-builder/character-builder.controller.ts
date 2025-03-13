/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Body, Controller, Logger, Post } from '@nestjs/common';

import { CharacterBuilderService } from './character-builder.service';
import { ChangeStepDto } from './dto/change-step.dto';

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
    const data = await this.characterBuilderService.changeStep(changeStepDto);
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
