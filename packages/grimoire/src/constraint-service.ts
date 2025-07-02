/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type {
  ConditionTest,
  Constraint,
  ConstraintViolation,
  FieldDefinition,
  GameSystemDefinition,
} from './types';

function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const pathSegments = path.split('.');

  return pathSegments.reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/**
 * @internal
 * Internal helper — exported for testing purposes only.
 * Use `evaluateField` for application-level constraint evaluation.
 *
 * @param condition - The condition clause of the constraint.
 * @param fieldValue - The value of the field being validated.
 * @param state - The full character state used for cross-field lookups.
 * @returns `true` if the condition passes; otherwise, `false`.
 */
export function evaluateCondition(
  condition: Constraint['if'],
  fieldValue: unknown,
  state: Record<string, unknown>,
): boolean {
  return Object.entries(condition).every(([ key, test ]) => {
    const value = key === 'this' ? fieldValue : getValueAtPath(state, key);
    return evaluateTest(test, value);
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

/**
 * @internal
 * Internal helper — exported for testing purposes only.
 * Use `evaluateField` for application-level constraint evaluation.
 *
 * @param test - An object containing a single operator and operand.
 * @param value - The value to compare against the operator.
 * @returns `true` if the value satisfies the test; otherwise, `false`.
 */
export function evaluateTest(test: ConditionTest, value: unknown): boolean {
  if ('$eq' in test) {
    return value === test.$eq;
  }

  if ('$neq' in test) {
    return value !== test.$neq;
  }

  if ('$lt' in test && typeof value === 'number') {
    return value < test.$lt!;
  }

  if ('$lte' in test && typeof value === 'number') {
    return value <= test.$lte!;
  }

  if ('$gt' in test && typeof value === 'number') {
    return value > test.$gt!;
  }

  if ('$gte' in test && typeof value === 'number') {
    return value >= test.$gte!;
  }

  if ('$in' in test && Array.isArray(test.$in)) {
    return test.$in.includes(value);
  }

  if ('$nin' in test && Array.isArray(test.$nin)) {
    return !test.$nin.includes(value);
  }

  if ('$count' in test && Array.isArray(value)) {
    return evaluateTest(test.$count!, value.length);
  }

  return false;
}
