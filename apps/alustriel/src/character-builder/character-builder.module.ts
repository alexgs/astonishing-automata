/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WinstonModule } from 'nest-winston';

import { EventStoreModule } from '../event-store/event-store.module';

import { CharacterBuilderController } from './character-builder.controller';
import { CharacterBuilderService } from './character-builder.service';
import { CharacterHydrator } from './character.hydrator';
import { PatchCharacterCommandHandler } from './commands/patch-character.command-handler';
import { StartCharacterHandler } from './commands/start-character.command-handler';
import { CharacterBuilderEventFactory } from './events/character-builder.event-factory';

@Module({
  controllers: [CharacterBuilderController],
  imports: [CqrsModule, EventStoreModule, WinstonModule],
  providers: [
    CharacterBuilderEventFactory,
    CharacterBuilderService,
    CharacterHydrator,
    Logger,
    PatchCharacterCommandHandler,
    StartCharacterHandler,
  ],
})
export class CharacterBuilderModule {}
