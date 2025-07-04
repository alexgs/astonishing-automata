/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ACTIONS, CharacterContext } from '@automata/state-machine';

import { EVENT_TYPES } from '../character-builder/constants';
import { CharacterStartedEventPayload } from '../character-builder/events/character-started.event';
import { ClassSelectedEventPayload } from '../character-builder/events/class-selected.event';
import { SpeciesSelectedEventPayload } from '../character-builder/events/species-selected.event';
import { StepChangedEventPayload } from '../character-builder/events/step-changed.event';
import { EventStoreReadModel } from '../event-store/interfaces';

type StateMachineEvent = {
  [key in keyof CharacterContext]: unknown;
} & {
  type: string;
};

/**
 * @deprecated
 */
export function createStateMachineEvent(
  eventStoreEvent: EventStoreReadModel,
): StateMachineEvent {
  switch (eventStoreEvent.type) {
    case EVENT_TYPES.CLASS_SELECTED:
      const classSelectedEventPayload: ClassSelectedEventPayload =
        eventStoreEvent.data as ClassSelectedEventPayload;
      return {
        type: ACTIONS.SELECT_CLASS,
        className: classSelectedEventPayload.className,
      };
    case EVENT_TYPES.STEP_CHANGED:
      const stepChangedEventPayload: StepChangedEventPayload =
        eventStoreEvent.data as StepChangedEventPayload;
      return {
        type: stepChangedEventPayload.nextStep,
      };
    case EVENT_TYPES.SPECIES_SELECTED:
      const speciesSelectedEventPayload: SpeciesSelectedEventPayload =
        eventStoreEvent.data as SpeciesSelectedEventPayload;
      return {
        type: ACTIONS.SELECT_SPECIES,
        species: speciesSelectedEventPayload.species,
      };
    default:
      throw new Error(
        `Unknown event type: ${eventStoreEvent.type} for event ${eventStoreEvent.id}`,
      );
  }
}
