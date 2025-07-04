/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Body, Controller, Logger, Post } from '@nestjs/common';

import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

import { CharacterBuilderService } from './character-builder.service';
import { PatchCharacterDto } from './dto/patch-character.dto';

@Controller({ path: 'character-builder', version: '1' })
export class CharacterBuilderController {
  constructor(
    private readonly characterBuilderService: CharacterBuilderService,
    private readonly logger: Logger,
  ) {}

  @Post('patch-character')
  async patchCharacter(@Body() patchCharacterDto: PatchCharacterDto) {
    this.logger.debug(
      'Received POST request to /character-builder/patch-character',
      CharacterBuilderController.name,
    );
    const data =
      await this.characterBuilderService.patchCharacter(patchCharacterDto);
    return { data };
  }

  @Post('start')
  async startCharacterCreation(@CurrentUserId() userId: string) {
    this.logger.debug(
      'Received POST request to /character-builder/start',
      CharacterBuilderController.name,
    );
    const data =
      await this.characterBuilderService.startCharacterCreation(userId);
    return { data };
  }
}
