/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

export const EVENT_TYPES = {
  STEP_CHANGED: 'event-types.step-changed',
  STARTED: 'event-types.character-builder.character-creation-started',
} as const;

export const STEPS = {
  SELECT_SPECIES: 'character-builder_steps_select-species',
  SELECT_CLASS: 'character-builder_steps_select-class',
  SELECT_SUBCLASS: 'character-builder_steps_select-subclass',
  SELECT_CLASS_FEATURES: 'character-builder_steps_select-class-features',
  CHOOSE_ABILITY_SCORE_METHOD:
    'character-builder_steps_choose-ability-score-method',
  ABILITY_SCORE_STANDARD: 'character-builder_steps_ability-score-standard',
  ABILITY_SCORE_POINT_BUY: 'character-builder_steps_ability-score-point-buy',
  ABILITY_SCORE_ROLLED: 'character-builder_steps_ability-score-rolled',
  SELECT_BACKGROUND: 'character-builder_steps_select-background',
  SELECT_BACKGROUND_FEATURES:
    'character-builder_steps_select-background-features',
  CHOOSE_EQUIPMENT_METHOD: 'character-builder_steps_choose-equipment-method',
  EQUIPMENT_STARTING: 'character-builder_steps_equipment-starting',
  EQUIPMENT_GOLD_BUY: 'character-builder_steps_equipment-gold-buy',
  SELECT_SPELLS: 'character-builder_steps_select-spells',
  FINAL_REVIEW: 'character-builder_steps_final-review',
  FINISH: 'character-builder_steps_finish',
} as const;

export const STREAM_TYPES = {
  CHARACTER: 'stream-types.character',
} as const;
