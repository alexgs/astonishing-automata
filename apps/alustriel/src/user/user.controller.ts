/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Controller, Get } from '@nestjs/common';

import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller({ path: 'user', version: '1' })
export class UserController {
  @Get('profile')
  getProfile(@CurrentUserId() userId: string) {
    return {
      message: `Hello, user ${userId}`,
    };
  }
}
