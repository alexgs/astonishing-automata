/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Controller, Logger, Post } from '@nestjs/common';

import { CharacterBuilderService } from './character-builder.service';

@Controller({ path: 'character-builder', version: '1' })
export class CharacterBuilderController {
  constructor(
    private readonly characterBuilderService: CharacterBuilderService,
    private readonly logger: Logger,
  ) {
    this.logger.debug(CharacterBuilderController.name);
  }

  @Post('start')
  async startCharacterCreation() {
    this.logger.debug('Received POST request to /character-builder/start');
    return this.characterBuilderService.startCharacterCreation();
  }
}
