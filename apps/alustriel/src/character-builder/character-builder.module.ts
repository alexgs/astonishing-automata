/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { EventStoreModule } from '../event-store/event-store.module';

import { CharacterBuilderController } from './character-builder.controller';
import { CharacterBuilderService } from './character-builder.service';
import { ChangeStepCommandHandler } from './commands/change-step.command-handler';
import { StartCharacterCreationHandler } from './commands/start-character-creation.command-handler';
import { CharacterBuilderEventFactory } from './events/character-builder.event-factory';

@Module({
  controllers: [CharacterBuilderController],
  imports: [CqrsModule, EventStoreModule],
  providers: [
    ChangeStepCommandHandler,
    CharacterBuilderEventFactory,
    CharacterBuilderService,
    StartCharacterCreationHandler,
  ],
})
export class CharacterBuilderModule {}
