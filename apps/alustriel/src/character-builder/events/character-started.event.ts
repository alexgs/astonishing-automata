/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { IEvent } from '@nestjs/cqrs';

import { INITIAL_STEP } from '../../state-machine/constants';

export class CharacterStartedEvent implements IEvent {
  constructor(
    public readonly characterId: string,
    public readonly nextStep: typeof INITIAL_STEP,
  ) {}
}
