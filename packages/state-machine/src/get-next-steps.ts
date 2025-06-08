/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import {
  type AnyStateMachine,
  type AnyMachineSnapshot,
  transition,
} from 'xstate';

import { StepName } from './types';

export function getNextSteps(
  machine: AnyStateMachine,
  state: AnyMachineSnapshot,
  stepName: string,
): { event: string; nextStep: StepName }[] {
  const stateNode = machine.getStateNodeById(`${machine.id}.${stepName}`);
  const validEvents = Object.keys(stateNode.on);

  return validEvents
    .map((event) => {
      const [nextState] = transition(machine, state, {
        type: event,
      });
      return {
        event,
        nextStep: nextState.value,
      };
    })
    .filter((step) => step.nextStep !== stepName);
}
