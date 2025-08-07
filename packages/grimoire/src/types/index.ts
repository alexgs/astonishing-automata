/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { DerivedFieldDefinition } from './derived-field-definition';
import { FieldDefinition } from './field-definition';
import { StartingValues } from './starting-values';

export * from './derived-field-definition';
export * from './field-definition';

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

export type GameSystemDefinition = {
  id: string;
  name: string;
  version: string;
  displayNameField?: string; // e.g., 'name', 'handle', 'callsign'
  startingValues: StartingValues;
  character: CharacterSchema;
  derived?: DerivedFieldDefinition[];
  steps: StepDefinition[];
  vars?: Record<string, any>; // E.g., { dieSteps: string[] }
};

export type GroupFieldDefinition = {
  type: 'group';
  label?: string;
  fields: { [key: string]: FieldDefinition };
};

export type SimpleOperator =
  | { $eq: unknown }
  | { $neq: unknown }
  | { $lt: number }
  | { $lte: number }
  | { $gt: number }
  | { $gte: number }
  | { $in: unknown[] | { $var: string } }
  | { $nin: unknown[] }

export type StepDefinition = {
  key: string;
  fields: string[]; // List of dot-separated field paths, e.g. 'attributes.agility'
  label?: string;
};

