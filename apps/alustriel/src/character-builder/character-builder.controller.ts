/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ChangeStepCommand } from './commands/change-step.command';
import { CharacterBuilderService } from './character-builder.service';

@Controller('character-builder')
export class CharacterBuilderController {
  constructor(
    private readonly characterBuilderService: CharacterBuilderService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('start/:sessionId')
  startSession(@Param('sessionId') sessionId: string) {
    this.characterBuilderService.createCharacterSession(sessionId);
    return {
      message: 'Character creation started',
      state: this.characterBuilderService.getCharacterState(sessionId),
    };
  }

  @Post('move/:sessionId')
  async moveStep(
    @Param('sessionId') sessionId: string,
    @Body() body: { event: 'NEXT' | 'PREV' | 'CONFIRM' },
  ) {
    return await this.commandBus.execute(
      new ChangeStepCommand(sessionId, body.event),
    );
  }

  @Get('state/:sessionId')
  getState(@Param('sessionId') sessionId: string) {
    return this.characterBuilderService.getCharacterState(sessionId);
  }
}
