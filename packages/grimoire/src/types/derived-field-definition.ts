/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { CostMapping } from './field-definition';

export type DerivedFieldDefinition =
  | SumCostMapping
  | SumFieldsDerivedField
  | SumPointsDerivedField;

// By default, look at the field definition for the cost mapping, but you can override it locally
export type SumCostMapping = {
  key: string;
  type: "sumCostMapping";
  source: string; // e.g. "skill"
  costMapping?: CostMapping;
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
  mapping:
    | Record<string, number> // e.g. { d4: 0, d6: 1, ... }
    | { $var: string };
};
