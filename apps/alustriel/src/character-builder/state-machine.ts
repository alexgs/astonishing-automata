/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { setup } from 'xstate';

import { STEPS } from './constants';

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

export const characterBuilderMachine = setup({
  types: {} as {
    context: CharacterContext;
  },
}).createMachine({
  id: 'characterBuilder',
  context: {}, // Stores character data
  initial: STEPS.SELECT_SPECIES,
  states: {
    [STEPS.SELECT_SPECIES]: {
      on: { [STEPS.SELECT_CLASS]: STEPS.SELECT_CLASS },
    },
    [STEPS.SELECT_CLASS]: {
      on: {
        [STEPS.SELECT_SUBCLASS]: STEPS.SELECT_SUBCLASS,
        [STEPS.SELECT_CLASS_FEATURES]: STEPS.SELECT_CLASS_FEATURES,
        [STEPS.SELECT_SPECIES]: STEPS.SELECT_SPECIES,
      },
    },
    [STEPS.SELECT_SUBCLASS]: {
      on: {
        [STEPS.SELECT_CLASS_FEATURES]: STEPS.SELECT_CLASS_FEATURES,
        [STEPS.SELECT_CLASS]: STEPS.SELECT_CLASS,
      },
    },
    [STEPS.SELECT_CLASS_FEATURES]: {
      on: {
        [STEPS.CHOOSE_ABILITY_SCORE_METHOD]: STEPS.CHOOSE_ABILITY_SCORE_METHOD,
        [STEPS.SELECT_CLASS]: STEPS.SELECT_CLASS,
      },
    },
    [STEPS.CHOOSE_ABILITY_SCORE_METHOD]: {
      on: {
        [STEPS.ABILITY_SCORE_STANDARD]: STEPS.ABILITY_SCORE_STANDARD,
        [STEPS.ABILITY_SCORE_POINT_BUY]: STEPS.ABILITY_SCORE_POINT_BUY,
        [STEPS.ABILITY_SCORE_ROLLED]: STEPS.ABILITY_SCORE_ROLLED,
        [STEPS.SELECT_CLASS_FEATURES]: STEPS.SELECT_CLASS_FEATURES,
      },
    },
    [STEPS.ABILITY_SCORE_STANDARD]: {
      on: { [STEPS.SELECT_BACKGROUND]: STEPS.SELECT_BACKGROUND },
    },
    [STEPS.ABILITY_SCORE_POINT_BUY]: {
      on: { [STEPS.SELECT_BACKGROUND]: STEPS.SELECT_BACKGROUND },
    },
    [STEPS.ABILITY_SCORE_ROLLED]: {
      on: { [STEPS.SELECT_BACKGROUND]: STEPS.SELECT_BACKGROUND },
    },
    [STEPS.SELECT_BACKGROUND]: {
      on: {
        [STEPS.SELECT_BACKGROUND_FEATURES]: STEPS.SELECT_BACKGROUND_FEATURES,
        [STEPS.CHOOSE_ABILITY_SCORE_METHOD]: STEPS.CHOOSE_ABILITY_SCORE_METHOD,
      },
    },
    [STEPS.SELECT_BACKGROUND_FEATURES]: {
      on: {
        [STEPS.CHOOSE_EQUIPMENT_METHOD]: STEPS.CHOOSE_EQUIPMENT_METHOD,
        [STEPS.SELECT_BACKGROUND]: STEPS.SELECT_BACKGROUND,
      },
    },
    [STEPS.CHOOSE_EQUIPMENT_METHOD]: {
      on: {
        [STEPS.EQUIPMENT_STARTING]: STEPS.EQUIPMENT_STARTING,
        [STEPS.EQUIPMENT_GOLD_BUY]: STEPS.EQUIPMENT_GOLD_BUY,
        [STEPS.SELECT_BACKGROUND_FEATURES]: STEPS.SELECT_BACKGROUND_FEATURES,
      },
    },
    [STEPS.EQUIPMENT_STARTING]: {
      on: {
        [STEPS.SELECT_SPELLS]: STEPS.SELECT_SPELLS,
        [STEPS.CHOOSE_EQUIPMENT_METHOD]: STEPS.CHOOSE_EQUIPMENT_METHOD,
      },
    },
    [STEPS.EQUIPMENT_GOLD_BUY]: {
      on: {
        [STEPS.SELECT_SPELLS]: STEPS.SELECT_SPELLS,
        [STEPS.CHOOSE_EQUIPMENT_METHOD]: STEPS.CHOOSE_EQUIPMENT_METHOD,
      },
    },
    [STEPS.SELECT_SPELLS]: {
      on: {
        [STEPS.FINAL_REVIEW]: STEPS.FINAL_REVIEW,
        [STEPS.CHOOSE_EQUIPMENT_METHOD]: STEPS.CHOOSE_EQUIPMENT_METHOD,
      },
    },
    [STEPS.FINAL_REVIEW]: {
      on: {
        [STEPS.FINISH]: STEPS.FINISH,
        [STEPS.SELECT_SPELLS]: STEPS.SELECT_SPELLS,
      },
    },
    [STEPS.FINISH]: {
      type: 'final',
    },
  },
});
