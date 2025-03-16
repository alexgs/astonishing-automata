/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ICommand } from '@nestjs/cqrs';

import { StepName } from '../../state-machine/types';

export class ChangeStepCommand implements ICommand {
  constructor(
    public readonly characterId: string,
    public readonly targetStep: StepName,
  ) {}
}
