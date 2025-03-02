/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { MoveStepCommand } from './move-step.command';
import { CharacterBuilderService } from '../character-builder.service';
import { StepMovedEvent } from '../events/step-moved.event';

@CommandHandler(MoveStepCommand)
export class MoveStepHandler implements ICommandHandler<MoveStepCommand> {
  constructor(
    private readonly characterBuilderService: CharacterBuilderService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: MoveStepCommand) {
    const { sessionId, event } = command;
    const newState = this.characterBuilderService.sendEvent(sessionId, event);

    // Emit an event when the step moves
    this.eventBus.publish(new StepMovedEvent(sessionId, newState.value));

    return newState;
  }
}
