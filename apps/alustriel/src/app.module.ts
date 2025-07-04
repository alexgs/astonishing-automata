/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ZodValidationPipe } from 'nestjs-zod';

import { AuthModule } from './auth/auth.module';
import { CharacterBuilderModule } from './character-builder/character-builder.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [],
  imports: [
    AuthModule,
    CharacterBuilderModule,
    ConfigModule.forRoot(),
    CqrsModule.forRoot(),
    UserModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
