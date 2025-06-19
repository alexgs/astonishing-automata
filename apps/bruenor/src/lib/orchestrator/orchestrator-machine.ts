/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { type CharacterContext, characterBuilderMachine } from '@automata/state-machine';
import { assign, sendTo, setup } from 'xstate';

import { sendUpdateToServer } from '../services/send-update-to-server';

interface OrchestratorContext {
  optimisticContext: CharacterContext | null;
  lastConfirmedContext: CharacterContext | null;
  retryCount: number;
  pendingEvent: OrchestratorEvent | null;
  error: Error | null;
}

type OrchestratorEvent =
  | { type: 'USER_ACTION'; event: unknown }
  | { type: 'RETRY' }
  | { type: 'RESTORE_CONTEXT'; data: CharacterContext };

const MAX_RETRIES = 3;

export const characterBuilderOrchestrator = setup({
  actors: {
    characterBuilderMachine: characterBuilderMachine,
  },
  types: {
    context: {
      optimisticContext: null,
      lastConfirmedContext: null,
      retryCount: 0,
      pendingEvent: null,
      error: null,
    } as OrchestratorContext,
    events: {} as OrchestratorEvent,
  },
}).createMachine({
  id: 'builderOrchestrator',
  initial: 'idle',
  context: {
    optimisticContext: null,
    lastConfirmedContext: null,
    retryCount: 0,
    pendingEvent: null,
    error: null,
  },
  invoke: {
    src: 'characterBuilderMachine',
  },
  states: {
    idle: {},
  },
});
