/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

// Can't use `.` in step names, but can use it in event names. 🤷🏻
// https://stately.ai/blog/2024-01-23-state-machines-whats-in-a-name#xstate-v5-and-dotcase
export const STEPS = {
  SELECT_SPECIES: 'character-builder:steps:select-species',
  SELECT_CLASS: 'character-builder:steps:select-class',
  SELECT_SUBCLASS: 'character-builder:steps:select-subclass',
  SELECT_CLASS_FEATURES: 'character-builder:steps:select-class-features',
  CHOOSE_ABILITY_SCORE_METHOD:
    'character-builder:steps:choose-ability-score-method',
  ABILITY_SCORE_STANDARD: 'character-builder:steps:ability-score-standard',
  ABILITY_SCORE_POINT_BUY: 'character-builder:steps:ability-score-point-buy',
  ABILITY_SCORE_ROLLED: 'character-builder:steps:ability-score-rolled',
  SELECT_BACKGROUND: 'character-builder:steps:select-background',
  SELECT_BACKGROUND_FEATURES:
    'character-builder:steps:select-background-features',
  CHOOSE_EQUIPMENT_METHOD: 'character-builder:steps:choose-equipment-method',
  EQUIPMENT_STARTING: 'character-builder:steps:equipment-starting',
  EQUIPMENT_GOLD_BUY: 'character-builder:steps:equipment-gold-buy',
  SELECT_SPELLS: 'character-builder:steps:select-spells',
  FINAL_REVIEW: 'character-builder:steps:final-review',
  FINISH: 'character-builder:steps:finish',
} as const;

export const INITIAL_STEP = STEPS.SELECT_SPECIES;
