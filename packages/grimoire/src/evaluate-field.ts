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

type ConstraintType = 'allow' | 'block';

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

  // No constraints → allowed
  if (!fieldDef || !fieldDef.constraints || fieldDef.constraints.length === 0) {
    return [];
  }

  const violations: ConstraintViolation[] = [];

  const results = fieldDef.constraints.map((constraint) => {
    const result = evaluateCondition(constraint.if, fieldValue, state);
    const type: ConstraintType = constraint.then?.allowed === false ? 'block' : 'allow';
    return { constraint, result, type };
  });

  // Only blocking constraints and none match → allowed
  if (results.every((r) => r.type === 'block' && !r.result)) {
    return [];
  }

  // Any blocking constraint matches → disallowed
  if (results.some((r) => r.type === 'block' && r.result)) {
    results.forEach((r) => {
      if (r.type === 'block' && r.result) {
        violations.push({
          path,
          reason: r.constraint.then.reason || `Invalid value`,
        });
      }
    });
    return violations;
  }

  // Only allowing constraints and none matches → disallowed
  if (results.every((r) => r.type === 'allow' && !r.result)) {
    results.forEach((r) => {
      if (r.type === 'allow' && !r.result) {
        violations.push({
          path,
          reason: r.constraint.then.reason || `Invalid value`,
        });
      }
    });
    return violations;
  }

  // All allowing constraints match and no blocking constraints match → allowed
  if (
    results.filter((r) => r.type === 'allow').every((r) => r.result) &&
    results.filter((r) => r.type === 'block').every((r) => !r.result)
  ) {
    return [];
  }

  // All constraints allow but not all match → disallowed
  if (results.every((r) => r.type === 'allow') && results.some((r) => !r.result)) {
    results.forEach((r) => {
      if (r.type === 'allow' && !r.result) {
        violations.push({
          path,
          reason: r.constraint.then.reason || `Invalid value`,
        });
      }
    });
    return violations;
  }

  // Both allowing and blocking constraints exist but none match → disallowed
  if (
    results.some((r) => r.type === 'allow') &&
    results.some((r) => r.type === 'block') &&
    results.every((r) => !r.result)
  ) {
    results.forEach((r) => {
      violations.push({
        path,
        reason: r.constraint.then.reason || `Invalid value`,
      });
    });
    return violations;
  }

  throw new Error(`Unexpected evaluation result for field "${path}"`);
}
