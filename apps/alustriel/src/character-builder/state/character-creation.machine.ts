/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { setup } from 'xstate';

interface CharacterContext {
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

export const characterCreationMachine = setup({
  types: {} as {
    context: CharacterContext;
  },
}).createMachine({
  id: 'characterCreation',
  initial: 'selectSpecies',
  context: {}, // Stores character data
  states: {
    selectSpecies: { on: { NEXT: 'selectCulture' } },
    selectCulture: { on: { PREV: 'selectSpecies', NEXT: 'selectClass' } },
    selectClass: { on: { PREV: 'selectCulture', NEXT: 'selectSubclass' } },
    selectSubclass: {
      on: { PREV: 'selectClass', NEXT: 'determineAbilityScores' },
    },
    determineAbilityScores: {
      on: { PREV: 'selectSubclass', NEXT: 'selectBackground' },
    },
    selectBackground: {
      on: { PREV: 'determineAbilityScores', NEXT: 'selectProficiencies' },
    },
    selectProficiencies: {
      on: { PREV: 'selectBackground', NEXT: 'selectEquipment' },
    },
    selectEquipment: {
      on: { PREV: 'selectProficiencies', NEXT: 'selectSpells' },
    },
    selectSpells: { on: { PREV: 'selectEquipment', NEXT: 'reviewCharacter' } },
    reviewCharacter: {
      on: { PREV: 'selectSpells', CONFIRM: 'characterCreated' },
    },
    characterCreated: { type: 'final' },
  },
});
