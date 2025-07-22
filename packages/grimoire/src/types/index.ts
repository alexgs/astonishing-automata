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

export type DerivedFieldDefinition =
  | SumFieldsDerivedField
  | SumPointsDerivedField;

export type FieldDefinition = {
  key: string;
  constraints?: Constraint[];
  options?: string[] | { $var: string };
  required?: boolean;
  type: 'boolean' | 'choice' | 'multichoice' | 'number' | 'string';

  // Future expansion (metadata for the UI)
  // ui?: {
  //   presentation?: "dice-step" | "dropdown" | "slider" | string;
  // };
};

export type GameSystemDefinition = {
  id: string;
  character: CharacterSchema;
  derived?: DerivedFieldDefinition[];
  name: string;
  steps: StepDefinition[];
  vars?: Record<string, any>; // E.g., { dieSteps: string[] }
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
  | { $in: unknown[] | { $var: string } }
  | { $nin: unknown[] }

export type StepDefinition = {
  key: string;
  fields: string[]; // List of dot-separated field paths, e.g. 'attributes.agility'
};

export type SumFieldsDerivedField = {
  key: string;
  type: "sumFields";
  fields: string[]; // e.g. ["attributePointsSpent", "skillPointsSpent"]
};

export type SumPointsDerivedField = {
  key: string;
  type: "sumPoints";
  source: string; // e.g. "attributes"
  mapping: Record<string, number>; // e.g. { d4: 0, d6: 1, ... }
};
