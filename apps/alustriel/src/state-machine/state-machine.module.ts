/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Module } from '@nestjs/common';

import { ActorFactory } from './actor.factory';

@Module({
  providers: [ActorFactory],
  exports: [ActorFactory],
})
export class StateMachineModule {}
