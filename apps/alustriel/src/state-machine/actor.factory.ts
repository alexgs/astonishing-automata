/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable } from '@nestjs/common';

import { Actor } from './actor.entity';

@Injectable()
export class ActorFactory {
  createActor(data: any): Actor {
    // Implement the logic to create and return an Actor instance
    return new Actor(data);
  }
}
