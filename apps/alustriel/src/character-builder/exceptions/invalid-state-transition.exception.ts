/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidStateTransitionException extends HttpException {
  constructor(message?: string) {
    super(message || 'Illegal state transition attempted', HttpStatus.CONFLICT);
  }
}
