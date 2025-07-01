/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type {
  Constraint,
  ConstraintViolation,
  FieldDefinition,
  GameSystemDefinition,
} from './types';

export type ComparisonOperator =
  | { $eq: unknown }
  | { $lt: number }
  | { $in: unknown[] }
  | { $count: { $lte: number } };

function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const pathSegments = path.split('.');

  return pathSegments.reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function evaluateCondition(
  condition: Constraint['if'],
  fieldValue: unknown,
  state: Record<string, unknown>,
): boolean {
  return Object.entries(condition).every(([ key, test ]) => {
    const value = key === 'this' ? fieldValue : getValueAtPath(state, key);

    if (test.$in) {
      if (Array.isArray(test.$in)) {
        return test.$in.includes(value);
      }
      return false;
    }

    if ('$eq' in test) {
      return value === test.$eq;
    }

    if (!!test.$lt && typeof value === 'number') {
      return value < test.$lt;
    }

    if (!!test.$count && Array.isArray(value)) {
      const countTests = test.$count;
      if ('$lte' in countTests) {
        return value.length <= countTests.$lte;
      }
    }

    return false; // Unsupported or failed condition
  });
}

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

  for (const constraint of fieldDef.constraints) {
    const passed = evaluateCondition(constraint.if, fieldValue, state);

    if (passed && constraint.then.allowed === true) {
      // Value is explicitly allowed — short-circuit
      allowed = true;
      failureReason = null;
      break;
    }

    if (passed && constraint.then.allowed === false) {
      // Failed this rule, but others might still allow it
      allowed = false;
      failureReason = constraint.then.reason ?? 'Invalid value';
    }

    if (!passed && constraint.then.allowed === true) {
      // Rule tried to allow something, but didn’t match — keep checking
      allowed = false;
      // Don't override failureReason unless we don't have one
      failureReason ??= constraint.then.reason ?? 'Invalid value';
    }
  }

  if (!allowed) {
    violations.push({ path, reason: failureReason ?? 'Invalid value' });
  }

  return violations;
}
