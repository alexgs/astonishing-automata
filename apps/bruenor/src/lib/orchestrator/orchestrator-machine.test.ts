/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { ACTIONS } from '@automata/state-machine';
import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';

import { characterBuilderOrchestrator } from './orchestrator-machine';

describe('characterBuilderOrchestrator', () => {
  it('starts', () => {
    const service = createActor(characterBuilderOrchestrator).start();
    const state = service.getSnapshot();
    expect(state.matches('idle')).toBe(true);
  });

  it('starts syncing after receiving a user action', () => {
    const machine = characterBuilderOrchestrator.provide({});
    const service = createActor(machine).start();

    service.send({
      type: 'USER_ACTION',
      event: { type: ACTIONS.SELECT_SPECIES, species: 'Elf' },
    });

    const state = service.getSnapshot();
    expect(state.matches('syncing')).toBe(true);
  });
});
