/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { ConstraintViolation, GameSystemDefinition } from './types';

export function evaluateField(
  path: string,
  state: Record<string, unknown>,
  system: GameSystemDefinition
): ConstraintViolation[] {
  return [
    {
      path,
      reason: 'Stub: this value is always invalid (for testing).'
    }
  ];
}
