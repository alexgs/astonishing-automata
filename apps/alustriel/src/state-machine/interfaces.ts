/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
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
