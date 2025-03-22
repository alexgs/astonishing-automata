/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Module } from '@nestjs/common';

import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
