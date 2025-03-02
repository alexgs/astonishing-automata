/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { IEvent } from '@nestjs/cqrs';

export class StepChangedEvent implements IEvent {
  constructor(
    public readonly characterId: string,
    public readonly step: string,
  ) {}
}
