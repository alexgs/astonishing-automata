/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { IEvent } from '@nestjs/cqrs';

export class StepMovedEvent implements IEvent {
  constructor(
    public readonly sessionId: string,
    public readonly newState: string,
  ) {}
}
