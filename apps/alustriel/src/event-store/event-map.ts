/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { SafeParseReturnType } from 'zod/lib/types';

import { EVENT_TYPES } from '../character-builder/constants';
import {
  CharacterStartedEvent,
  CharacterStartedEventPayloadSchema,
} from '../character-builder/events/character-started.event';
import {
  StepChangedEvent,
  StepChangedEventPayloadSchema,
} from '../character-builder/events/step-changed.event';

interface EventMap {
  constructor: new (...args: unknown[]) => unknown;
  schema: (data: unknown) => SafeParseReturnType<unknown, unknown>;
}

export const eventMap: { [event: string]: EventMap } = {
  [EVENT_TYPES.STEP_CHANGED]: {
    constructor: StepChangedEvent,
    schema: StepChangedEventPayloadSchema.safeParse.bind(
      StepChangedEventPayloadSchema,
    ),
  },
  [EVENT_TYPES.STARTED]: {
    constructor: CharacterStartedEvent,
    schema: CharacterStartedEventPayloadSchema.safeParse.bind(
      CharacterStartedEventPayloadSchema,
    ),
  },
} as const;
