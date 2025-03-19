/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

export const EVENT_TYPES = {
  CLASS_SELECTED: 'event-types.character-builder.class-selected',
  SPECIES_SELECTED: 'event-types.character-builder.species-selected',
  STARTED: 'event-types.character-builder.character-creation-started',
  STEP_CHANGED: 'event-types.character-builder.step-changed',
} as const;

export const STREAM_TYPES = {
  CHARACTER: 'stream-types.character',
} as const;
