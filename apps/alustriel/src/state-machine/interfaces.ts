/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

export interface CharacterContext {
  species?: string;
  culture?: string;
  class?: string;
  subclass?: string;
  abilityScores?: Record<string, number>;
  background?: string;
  skills?: string[];
  tools?: string[];
  languages?: string[];
  equipment?: string[];
  spells?: string[];
}
