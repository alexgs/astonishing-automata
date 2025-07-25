/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Constraint } from './index';

export type ModifierEffect = {
  target: string;             // e.g., 'attributes.${value}'
  value: string;              // e.g., 'step+1', '+1', etc.
  source?: string;            // Optional source tag
  reason?: string;            // Optional description for audit/UI
};

export type SpendEffect = {
  when: { [key: string]: any };  // Simple condition, e.g. { type: { $eq: 'attribute' } }
  apply: ModifierEffect;
};

export type ItemSchema =
  | Record<string, 'boolean'| 'number' | 'string' >
  | Record<string, FieldDefinition>;

export type ListVariant = {
  label?: string;
  schema: Record<string, FieldDefinition>;
};

// --- FIELD DEFINITIONS ---

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

export type ListFieldDefinition = {
  key: string;
  type: 'list';
  options: Record<string, unknown>[] | { $var: string };
  optionLabels?: { $var: string };
  itemSchema?: ItemSchema; // optional metadata per item
  variants?: Record<string, ListVariant>; // `variants` takes precedence over `itemSchema`
  budget?: {
    total: number | { $var: string };
    spent: string; // derived field key
    message?: string;
  };
  constraints?: Constraint[];
  selectEffects?: SpendEffect[];
};

export type FieldDefinition =
  | BaseFieldDefinition
  | BudgetFieldDefinition
  | ListFieldDefinition
  ;
