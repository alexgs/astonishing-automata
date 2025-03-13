/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { ICommand } from '@nestjs/cqrs';

import { StepName } from '../../state-machine/types';

export class ChangeStepCommand implements ICommand {
  constructor(
    public readonly characterId: string,
    public readonly targetStep: StepName,
  ) {}
}
