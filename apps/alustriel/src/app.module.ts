/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterBuilderModule } from './character-builder/character-builder.module';

@Module({
  controllers: [AppController],
  imports: [CqrsModule.forRoot(), CharacterBuilderModule],
  providers: [AppService],
})
export class AppModule {}
