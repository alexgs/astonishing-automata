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

// If you change this value, you will need to increase the timeout in the test, too
const BASE_DELAY = 100; // Base delay for retries in milliseconds
const MAX_RETRIES = 3;

export const characterBuilderOrchestrator = setup({
  actors: {
    [characterBuilderMachine.id]: characterBuilderMachine,
    sendUpdateToServer: fromPromise(({ input }) => {
      return sendUpdateToServer(input);
    }),
  },
  delays: {
    syncRetry: ({ context }) => Math.pow(2, context.retryCount) * BASE_DELAY,
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
    systemId: characterBuilderMachine.id,
    src: characterBuilderMachine.id,
  },
  states: {
    idle: {
      on: {
        USER_ACTION: {
          target: 'optimisticUpdate',
          actions: [
            assign({
              pendingEvent: ({ event }) => event,
            }),
            sendTo(characterBuilderMachine.id, ({ event }: { event: UserAction }) => event.event),
          ],
        },
      },
    },
    optimisticUpdate: {
      after: {
        0: {
          target: 'syncing',
          actions: [
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
        src: 'sendUpdateToServer',
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
    retrying: {
      after: {
        syncRetry: {
          target: 'syncing',
          actions: assign({
            retryCount: ({ context }) => context.retryCount + 1,
          }),
        },
      },
      always: [
        {
          guard: ({ context }) => context.retryCount >= MAX_RETRIES,
          target: 'error',
          actions: sendTo(
            characterBuilderMachine.id,
            ({ context }: { context: OrchestratorContext }) => ({
              type: 'RESTORE_CONTEXT',
              data: context.lastConfirmedContext,
            })
          ),
        },
      ],
    },
    error: {},
  },
});
