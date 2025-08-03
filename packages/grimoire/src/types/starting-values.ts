/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

type PrimitiveValue = string | number | boolean;

export type StepReference = {
  from: string;       // e.g., 'dieSteps'
  value: string;      // e.g., 'd4'
};

export type StartingValues = {
  [field: string]:
    | PrimitiveValue
    | StepReference
    | Record<string, PrimitiveValue | StepReference>;
};
