/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

export type CharacterSchema = {
  [key: string]: FieldDefinition | GroupFieldDefinition;
};

export type ConditionTest =
  | SimpleOperator
  | { $count: SimpleOperator };

export type Constraint = {
  if: { [field: string]: ConditionTest };
  then: { allowed: boolean; reason?: string };
};

export type ConstraintViolation = {
  path: string;
  reason: string;
};

export type FieldDefinition = {
  key: string;
  type: 'boolean' | 'choice' | 'multichoice' | 'number' | 'string';
  required?: boolean;
  options?: string[];
  constraints?: Constraint[];
};

export type GameSystemDefinition = {
  id: string;
  name: string;
  character: CharacterSchema;
  steps: StepDefinition[];
};

export type GroupFieldDefinition = {
  type: 'group';
  fields: { [key: string]: FieldDefinition };
};

export type SimpleOperator =
  | { $eq: unknown }
  | { $neq: unknown }
  | { $lt: number }
  | { $lte: number }
  | { $gt: number }
  | { $gte: number }
  | { $in: unknown[] }
  | { $nin: unknown[] }

export type StepDefinition = {
  key: string;
  fields: string[]; // List of dot-separated field paths, e.g. 'attributes.agility'
};
