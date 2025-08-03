/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { Expression } from './expression';
import { Constraint } from './index';

export type InputSchema =
  | Record<string, 'boolean' | 'number' | 'string'>
  | Record<string, FieldDefinition>;

export type ListVariant = {
  label?: string;
  schema: Record<string, FieldDefinition>;
};

export type ModifierEffect = {
  targetField: string;        // e.g., 'attributes.${value}'
  effectVerb: 'add' | 'increase' | 'decrease' | 'set';
  effectType: 'step' | 'value';
  effectVar?: string;         // Optional variable for steps, e.g., 'dieSteps'
  value: number | string;     // Amount to change the target field by
  source?: string;            // Optional source tag
  reason?: string;            // Optional description for audit/UI
};

export type SelectEffect = {
  when: { [key: string]: any };  // Simple condition, e.g. { type: { $eq: 'attribute' } }
  apply: ModifierEffect;
};

// --- COST MAPPING ---

export type CostMapping = {
  compare: {
    left: Expression;
    right: Expression;
  };
  mapping: Array<{
    if: CostCondition;
    cost: Expression;
  }>;
};

export type CostCondition =
  | { $eq: boolean }
  | { $lt: boolean }
  | { $lte: boolean }
  | { $gt: boolean }
  | { $gte: boolean }
  | { $in: unknown[] }
  | { $nin: unknown[] }
  | { $always: true };

// --- FIELD DEFINITIONS ---

export type BaseFieldDefinition = {
  key: string;
  type: 'boolean' | 'choice' | 'multichoice' | 'number' | 'string';
  constraints?: Constraint[];
  options?: string[] | { $var: string };
  optionLabels?: string[] | { $var: string };
  required?: boolean;
  selectEffect?: ModifierEffect; // Shortcut for a single select effect
  selectEffects?: SelectEffect[] | { $var: string };
  ui?: {
    minSteps?: number;
    maxSteps?: number;
    presentation?: "dice-step" | "dropdown" | "slider" | string;
  };
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
  constraints?: Constraint[]; // Not used with this field type; included for consistency between field types
};

export type ListFieldDefinition = {
  key: string;
  type: 'list';
  uniqueKeys?: boolean; // if true, each option can only be selected once; default is `true`
  options: Record<string, unknown>[] | { $var: string };
  optionLabels?: { $var: string };
  inputSchema?: InputSchema; // Input suboptions for each user selection
  variants?: Record<string, ListVariant>; // `variants` takes precedence over `inputSchema`
  budget?: {
    total: number | { $var: string };
    spent: string; // derived field key
    message?: string;
  };
  costMapping?: CostMapping;
  constraints?: Constraint[] | { $var: string };
  selectEffects?: SelectEffect[];
};

export type FieldDefinition =
  | BaseFieldDefinition
  | BudgetFieldDefinition
  | ListFieldDefinition
  ;
