/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EventStoreService } from '../../event-store/event-store.service';
import { ActorFactory } from '../../state-machine/actor.factory';
import { EVENT_TYPES, STREAM_TYPES } from '../constants';
import { StepChangedEvent } from '../events/step-changed.event';

import { ChangeStepCommand } from './change-step.command';

@CommandHandler(ChangeStepCommand)
export class ChangeStepCommandHandler
  implements ICommandHandler<ChangeStepCommand>
{
  constructor(
    private readonly actorFactory: ActorFactory,
    private readonly eventStoreService: EventStoreService,
    private readonly logger: Logger,
  ) {}

  async execute(command: ChangeStepCommand) {
    const actor = await this.actorFactory.getActor(command.characterId);
    const previousStep = actor.getSnapshot().value;
    this.logger.debug(`Previous step: ${previousStep}`, ChangeStepCommandHandler.name);

    const payload: StepChangedEvent = {
      characterId: command.characterId,
      nextStep: command.targetStep,
      previousStep,
    };

    const event = await this.eventStoreService.createEvent(
      command.characterId,
      STREAM_TYPES.CHARACTER,
      EVENT_TYPES.STEP_CHANGED,
      { ...payload }, // Use spread operator for type compatibility
    );
    await this.eventStoreService.appendEvent(event);

    return { characterId: command.characterId, targetStep: command.targetStep };
  }
}
