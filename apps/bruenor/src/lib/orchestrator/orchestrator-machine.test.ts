/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';

import { characterBuilderOrchestrator } from './orchestrator-machine';

describe('characterBuilderOrchestrator', () => {
  it('starts', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _service = createActor(characterBuilderOrchestrator).start();
    expect(true).toBe(true);
  });
});
