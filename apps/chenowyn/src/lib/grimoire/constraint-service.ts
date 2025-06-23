/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type {
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
  condition: Record<string, ComparisonOperator>,
  fieldValue: unknown,
  state: Record<string, unknown>,
): boolean {
  return Object.entries(condition).every(([ key, test ]) => {
    const value = key === 'this' ? fieldValue : getValueAtPath(state, key);

    if ('$in' in test) {
      return test.$in.includes(value);
    }

    if ('$eq' in test) {
      return value === test.$eq;
    }

    if ('$lt' in test && typeof value === 'number') {
      return value < test.$lt;
    }

    if ('$count' in test && Array.isArray(value)) {
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

  for (const constraint of fieldDef.constraints) {
    const passed = evaluateCondition(constraint.if, fieldValue, state);

    if (!passed && constraint.then.allowed === false) {
      violations.push({
        path,
        reason: constraint.then.reason ?? 'Invalid value',
      });
    }
  }

  return violations;
}
