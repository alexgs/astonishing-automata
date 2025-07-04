/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { SafeParseReturnType } from 'zod';

import { EVENT_TYPES } from '../character-builder/constants';
import {
  CharacterPatchedEvent,
  CharacterPatchedEventPayloadSchema,
} from '../character-builder/events/character-patched.event';
import {
  CharacterStartedEvent,
  CharacterStartedEventPayloadSchema,
} from '../character-builder/events/character-started.event';
import {
  ClassSelectedEvent,
  ClassSelectedEventPayloadSchema,
} from '../character-builder/events/class-selected.event';
import {
  SpeciesSelectedEvent,
  SpeciesSelectedEventPayloadSchema,
} from '../character-builder/events/species-selected.event';
import {
  StepChangedEvent,
  StepChangedEventPayloadSchema,
} from '../character-builder/events/step-changed.event';

type GenericConstructor = new (...args: unknown[]) => unknown;

interface EventMap {
  constructor: GenericConstructor;
  schema: (data: unknown) => SafeParseReturnType<unknown, unknown>;
}

export const eventMap: { [event: string]: EventMap } = {
  [EVENT_TYPES.CLASS_SELECTED]: {
    constructor: ClassSelectedEvent as GenericConstructor,
    schema: ClassSelectedEventPayloadSchema.safeParse.bind(
      ClassSelectedEventPayloadSchema,
    ),
  },
  [EVENT_TYPES.PATCHED]: {
    constructor: CharacterPatchedEvent as GenericConstructor,
    schema: CharacterPatchedEventPayloadSchema.safeParse.bind(
      CharacterPatchedEventPayloadSchema,
    ),
  },
  [EVENT_TYPES.SPECIES_SELECTED]: {
    constructor: SpeciesSelectedEvent as GenericConstructor,
    schema: SpeciesSelectedEventPayloadSchema.safeParse.bind(
      SpeciesSelectedEventPayloadSchema,
    ),
  },
  [EVENT_TYPES.STARTED]: {
    constructor: CharacterStartedEvent as GenericConstructor,
    schema: CharacterStartedEventPayloadSchema.safeParse.bind(
      CharacterStartedEventPayloadSchema,
    ),
  },
  [EVENT_TYPES.STEP_CHANGED]: {
    constructor: StepChangedEvent as GenericConstructor,
    schema: StepChangedEventPayloadSchema.safeParse.bind(
      StepChangedEventPayloadSchema,
    ),
  },
} as const;
