import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ClerkAuthGuard } from './guards/clerk-auth-guard.guard';

@Module({
  providers: [
    // Enable authentication for all routes
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AuthModule {}
