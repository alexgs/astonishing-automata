/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { StepName } from '@automata/state-machine';
import { ICommand } from '@nestjs/cqrs';

/**
 * @deprecated
 */
export class ChangeStepCommand implements ICommand {
  constructor(
    public readonly characterId: string,
    public readonly targetStep: StepName,
  ) {}
}
