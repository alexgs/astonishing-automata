/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { type CharacterContext, characterBuilderMachine } from '@automata/state-machine';
import {
  type ErrorActorEvent,
  assign,
  fromPromise,
  sendTo,
  setup,
} from 'xstate';

import { sendUpdateToServer } from '../services/send-update-to-server';

interface OrchestratorContext {
  optimisticContext: CharacterContext | null;
  lastConfirmedContext: CharacterContext | null;
  retryCount: number;
  pendingEvent: OrchestratorEvent | null;
  error: ErrorActorEvent | null;
}

type OrchestratorEvent =
  | UserAction
  | { type: 'RETRY' }
  | { type: 'RESTORE_CONTEXT'; data: CharacterContext };

type UserAction = { type: 'USER_ACTION'; event: unknown };

const MAX_RETRIES = 3;

export const characterBuilderOrchestrator = setup({
  actors: {
    [characterBuilderMachine.id]: characterBuilderMachine,
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
    id: characterBuilderMachine.id,
    src: characterBuilderMachine,
  },
  states: {
    idle: {
      on: {
        USER_ACTION: {
          target: 'syncing',
          actions: [
            assign({
              pendingEvent: ({ event }) => event,
            }),
            sendTo(characterBuilderMachine.id, ({ event }: { event: UserAction }) => event.event),
            assign({
              optimisticContext: ({ system }) => {
                const child = system.get(characterBuilderMachine.id);
                return child?.getSnapshot()?.context || null;
              },
            }),
          ],
        },
      },
    },
    syncing: {
      invoke: {
        input: ({ context }) => ({ pendingEvent: context.pendingEvent }),
        src: fromPromise(
          ({ input }) => sendUpdateToServer(input.pendingEvent)
        ),
        onDone: {
          target: 'idle',
          actions: assign({
            lastConfirmedContext: ({ context }) => context.optimisticContext,
            retryCount: 0,
            error: null,
          }),
        },
        onError: {
          target: 'retrying',
          actions: assign({
            error: ({ event }) => event.error as ErrorActorEvent,
          }),
        },
      },
    },
  },
});
