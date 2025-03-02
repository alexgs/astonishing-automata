/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CharacterBuilderService } from './character-builder.service';
import { CharacterBuilderController } from './character-builder.controller';
import { MoveStepHandler } from './commands/change-step.command-handler';

@Module({
  controllers: [CharacterBuilderController],
  imports: [CqrsModule],
  providers: [CharacterBuilderService, MoveStepHandler],
})
export class CharacterBuilderModule {}
