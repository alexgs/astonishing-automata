/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Controller, Post } from '@nestjs/common';

import { CharacterBuilderService } from './character-builder.service';

@Controller({ path: 'character-builder', version: '1' })
export class CharacterBuilderController {
  constructor(
    private readonly characterBuilderService: CharacterBuilderService,
  ) {}

  @Post('start')
  async startCharacterCreation() {
    return this.characterBuilderService.startCharacterCreation();
  }
}
