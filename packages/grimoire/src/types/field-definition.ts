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

export type SelectEffect = {
  when: { [key: string]: any };  // Simple condition, e.g. { type: { $eq: 'attribute' } }
  apply: ModifierEffect;
};

export type InputSchema =
  | Record<string, 'boolean'| 'number' | 'string' >
  | Record<string, FieldDefinition>;

export type ListVariant = {
  label?: string;
  schema: Record<string, FieldDefinition>;
};

// --- COST MAPPING ---

export type CostMapping = {
  compare: {
    left: CostExpression;
    right: CostExpression;
  };
  mapping: Array<{
    if: CostCondition;
    cost: CostExpression;
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

export type CostExpression =
  | number
  | string
  | { $add: CostExpression[] }
  | { $sub: CostExpression[] }
  | { $mul: CostExpression[] }
  | { $div: CostExpression[] }
  | { $var: string }             // vars.dieCosts.strength
  | { $field: string }           // value from user input
  | { $fromOption: string }      // metadata from selected item
  | { $path: string };           // absolute path into character schema

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
  constraints?: Constraint[];
  selectEffects?: SelectEffect[];
};

export type FieldDefinition =
  | BaseFieldDefinition
  | BudgetFieldDefinition
  | ListFieldDefinition
  ;
