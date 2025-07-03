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

type ConstraintResult = {
  result: false;
  violations: ConstraintViolation[];
} | {
  result: true;
  violations: null;
}

type ConstraintType = 'allow' | 'block';

export function evaluateField(
  path: string,
  state: Record<string, unknown>,
  system: GameSystemDefinition,
): ConstraintResult {
  const parentField = getValueAtPath(system.character, path.replace(/\.[^.]+$/, '') as string) as {
    fields?: Record<string, unknown>
  };
  const fieldKey = path.split('.').pop() as string;
  const fieldDef = parentField?.fields?.[fieldKey] as FieldDefinition;
  const fieldValue = getValueAtPath(state, path);

  // No constraints → allowed
  if (!fieldDef || !fieldDef.constraints || fieldDef.constraints.length === 0) {
    return { result: true, violations: null };
  }

  const results = fieldDef.constraints.map((constraint) => {
    const result = evaluateCondition(constraint.if, fieldValue, state);
    const type: ConstraintType = constraint.then?.allowed === false ? 'block' : 'allow';
    return { constraint, result, type };
  });

  const violations = results
    .filter((r) =>
      (r.type === 'allow' && !r.result) ||
      (r.type === 'block' && r.result)
    )
    .map((r) => ({
      path,
      reason: r.constraint.then?.reason || 'Invalid value',
    }));

  let result: boolean = false;

  // Only blocking constraints
  if (results.every((r) => r.type === 'block')) {
    // At least one match → not allowed
    if (results.some((r) => r.result)) {
      result = false;

    // No matches → allowed
    } else {
      result = true;
    }

  // Only allowing constraints
  } else if (results.every((r) => r.type === 'allow')) {
    // All match → allowed
    if (results.every((r) => r.result)) {
      result = true;

    // At least one does not match → not allowed
    } else {
      result = false;
    }

  // Mixed constraints
  } else {
    // If all "allow" constraints match and no "block" constraints match → allowed
    if (
      results.every((r) =>
        (r.type === 'allow' && r.result) || (r.type === 'block' && !r.result))
    ) {
      result = true;

    // Otherwise → not allowed
    } else {
      result = false;
    }
  }

  if (result) {
    return { result: true, violations: null };
  } else {
    return { result: false, violations };
  }
}
