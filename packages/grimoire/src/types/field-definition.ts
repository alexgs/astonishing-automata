/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Constraint } from './index';

export type BaseFieldDefinition = {
  key: string;
  constraints?: Constraint[];
  options?: string[] | { $var: string };
  optionLabels?: string[] | { $var: string };
  required?: boolean;
  type: 'boolean' | 'choice' | 'multichoice' | 'number' | 'string';

  // Future expansion (metadata for the UI)
  // ui?: {
  //   presentation?: "dice-step" | "dropdown" | "slider" | string;
  // };
};

export type BudgetFieldDefinition = {
  key: string;
  type: 'budget';
  label: string;
  total: number | { $var: string }; // can be fixed or resolved from vars
  spent: string; // key of derived field to watch
  // warnAt?: number;
  // hardLimit?: boolean;
  message?: string;
};

export type FieldDefinition =
  | BaseFieldDefinition
  | BudgetFieldDefinition;
