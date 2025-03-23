/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { getAuth } from '@clerk/express';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const auth = getAuth(request);

    if (!auth.userId) {
      return false;
    }

    // Attach Clerk auth to the request object for later use
    request.auth = auth;
    return true;
  }
}
