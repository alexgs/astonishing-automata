/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { AuthObject } from '@clerk/express';

declare module 'express' {
  interface Request {
    auth?: AuthObject;
  }
}
