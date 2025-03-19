/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WinstonModule } from 'nest-winston';

import { EventStoreModule } from '../event-store/event-store.module';
import { StateMachineModule } from '../state-machine/state-machine.module';

import { CharacterBuilderController } from './character-builder.controller';
import { CharacterBuilderService } from './character-builder.service';
import { ChangeStepCommandHandler } from './commands/change-step.command-handler';
import { SelectClassCommandHandler } from './commands/select-class.command-handler';
import { SelectSpeciesCommandHandler } from './commands/select-species.command-handler';
import { StartCharacterCreationHandler } from './commands/start-character-creation.command-handler';
import { CharacterBuilderEventFactory } from './events/character-builder.event-factory';

@Module({
  controllers: [CharacterBuilderController],
  imports: [CqrsModule, EventStoreModule, StateMachineModule, WinstonModule],
  providers: [
    ChangeStepCommandHandler,
    CharacterBuilderEventFactory,
    CharacterBuilderService,
    Logger,
    SelectClassCommandHandler,
    SelectSpeciesCommandHandler,
    StartCharacterCreationHandler,
  ],
})
export class CharacterBuilderModule {}
