/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { IEvent } from '@nestjs/cqrs';

import { StepName } from '../../state-machine/types';

export class StepChangedEvent implements IEvent {
  constructor(
    public readonly characterId: string,
    public readonly nextStep: StepName,
    public readonly previousStep: StepName,
  ) {}
}
