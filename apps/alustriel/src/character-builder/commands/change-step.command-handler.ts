/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { EVENT_TYPES, STREAM_TYPES } from '../constants';

import { ChangeStepCommand } from './change-step.command';

@CommandHandler(ChangeStepCommand)
export class ChangeStepCommandHandler
  implements ICommandHandler<ChangeStepCommand>
{
  constructor(
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async execute(command: ChangeStepCommand) {
    const event = await this.eventStoreService.createEvent(
      command.characterId,
      STREAM_TYPES.CHARACTER,
      EVENT_TYPES.STEP_CHANGED,
      { step: command.step },
    );
    await this.eventStoreService.appendEvent(event);

    return { characterId: command.characterId, step: command.step };
  }
}
