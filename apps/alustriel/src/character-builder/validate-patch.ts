/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { evaluateField } from '@automata/grimoire';
import type { GameSystemDefinition } from '@automata/grimoire';
import { merge } from 'lodash-es';

export interface PatchValidationResult {
  isValid: boolean;
  invalidFields: { key: string; reason?: string }[];
}

export function validatePatch(
  system: GameSystemDefinition,
  currentState: Record<string, unknown>,
  patch: Record<string, unknown>,
): PatchValidationResult {
  const nextState = merge(currentState, patch);
  const invalidFields: { key: string; reasons?: string[] }[] = [];

  const allFieldKeys = system.steps.flatMap((step) => step.fields);
  for (const fieldKey of allFieldKeys) {
    const result = evaluateField(fieldKey, nextState, system);

    if (!result.result) {
      invalidFields.push({
        key: fieldKey,
        reasons: result.violations.map((v) => v.reason),
      });
    }
  }

  return {
    isValid: invalidFields.length === 0,
    invalidFields,
  };
}
