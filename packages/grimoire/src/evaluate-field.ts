/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { evaluateCondition } from './evaluate-condition';
import { getValueAtPath } from './get-value-at-path';
import type {
  ConstraintViolation,
  FieldDefinition,
  GameSystemDefinition,
} from './types';

// TODO I kinda think there should be a boolean in the returned object just to be explicit about whether the field is valid or not.

export function evaluateField(
  path: string,
  state: Record<string, unknown>,
  system: GameSystemDefinition,
): ConstraintViolation[] {
  const parentField = getValueAtPath(system.character, path.replace(/\.[^.]+$/, '') as string) as {
    fields?: Record<string, unknown>
  };
  const fieldKey = path.split('.').pop() as string;
  const fieldDef = parentField?.fields?.[fieldKey] as FieldDefinition;
  const fieldValue = getValueAtPath(state, path);

  if (!fieldDef || !fieldDef.constraints) return [];

  const violations: ConstraintViolation[] = [];

  let allowed = true;
  let failureReason: string | null = null;
  let wasExplicitlyDisallowed = false;

  for (const constraint of fieldDef.constraints) {
    const passed = evaluateCondition(constraint.if, fieldValue, state);

    if (passed && constraint.then.allowed === true) {
      if (!wasExplicitlyDisallowed) {
        // Short-circuit only if no disallowed rule has matched yet
        allowed = true;
        failureReason = null;
        break;
      }
    }

    if (passed && constraint.then.allowed === false) {
      wasExplicitlyDisallowed = true;
      allowed = false;
      failureReason = constraint.then.reason ?? 'Invalid value';
    }

    if (!passed && constraint.then.allowed === true) {
      // Rule didn't match, so we continue
      allowed = false;
      failureReason ??= constraint.then.reason ?? 'Invalid value';
    }
  }

  if (!allowed) {
    violations.push({ path, reason: failureReason ?? 'Invalid value' });
  }

  return violations;
}
