/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ACTIONS, type CharacterContext } from '@automata/state-machine';
import { describe, it, expect } from 'vitest';
import { createActor, fromPromise } from 'xstate';

import { characterBuilderOrchestrator } from './orchestrator-machine';

describe('characterBuilderOrchestrator', () => {
  it('starts', () => {
    const service = createActor(characterBuilderOrchestrator).start();
    const state = service.getSnapshot();
    expect(state.matches('idle')).toBe(true);
  });

  it('starts optimistic update after receiving a user action', () => {
    const machine = characterBuilderOrchestrator.provide({});
    const service = createActor(machine).start();

    service.send({
      type: 'USER_ACTION',
      event: { type: ACTIONS.SELECT_SPECIES, species: 'Elf' },
    });

    const state = service.getSnapshot();
    expect(state.matches('optimisticUpdate')).toBe(true);
  });

  it('starts syncing after completing the optimistic update', async () => {
    const machine = characterBuilderOrchestrator.provide({
      actors: {
        sendUpdateToServer: fromPromise(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(true as unknown); // TODO Fix this type hack
            }, 10);
          });
        }),
      },
    });
    const service = createActor(machine).start();

    service.send({
      type: 'USER_ACTION',
      event: { type: ACTIONS.SELECT_SPECIES, species: 'Elf' },
    });
    await new Promise((r) => setTimeout(r, 0)); // wait for async

    const state = service.getSnapshot();
    expect(state.matches('syncing')).toBe(true);
  });

  it('syncs data to the server', async () => {
    const expectedContext: CharacterContext = {
      species: 'Elf',
    };
    const machine = characterBuilderOrchestrator.provide({
      actors: {
        sendUpdateToServer: fromPromise(() => Promise.resolve(true as unknown)), // TODO Fix this type hack
      },
    });
    const service = createActor(machine).start();

    service.send({
      type: 'USER_ACTION',
      event: { type: ACTIONS.SELECT_SPECIES, species: 'Elf' },
    });
    await new Promise((r) => setTimeout(r, 10)); // wait for async

    const state = service.getSnapshot();
    expect(state.matches('idle')).toBe(true);
    expect(state.context.optimisticContext).toEqual(expectedContext);
    expect(state.context.lastConfirmedContext).toEqual(expectedContext);
  });
});
