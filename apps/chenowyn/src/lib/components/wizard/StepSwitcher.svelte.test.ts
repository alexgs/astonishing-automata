/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render, screen } from '@testing-library/svelte';
import { vi } from 'vitest';

vi.mock('$lib/components/wizard/FirstStep.svelte', async () => {
  // @ts-expect-error -- Unresolved path to the mock component
  // eslint-disable-next-line import/no-unresolved
  const mod = await import('$__mocks__/$lib/components/wizard/FirstStep.svelte');
  return { default: mod.default };
});

vi.mock('$lib/components/wizard/DynamicStep.svelte', async () => {
  // @ts-expect-error -- Unresolved path to the mock component
  // eslint-disable-next-line import/no-unresolved
  const mod = await import('$__mocks__/$lib/components/wizard/DynamicStep.svelte');
  return { default: mod.default };
});

vi.mock('@automata/grimoire', async () => {
  const actual = await vi.importActual<typeof import('@automata/grimoire')>('@automata/grimoire');
  return {
    ...actual,
    SavageWorlds: {
      steps: [
        { key: 'attributes', fields: [] },
        { key: 'skills', fields: [] }
      ]
    }
  };
});

import StepSwitcher from './StepSwitcher.svelte';

describe('StepSwitcher.svelte', () => {
  const characterId = 'abc123';

  test('renders FirstStep when step is null', () => {
    render(StepSwitcher, { props: { characterId, step: null } });
    expect(screen.getByTestId('first-step')).toBeInTheDocument();
  });

  test('renders DynamicStep for known step', () => {
    render(StepSwitcher, { props: { characterId, step: 'skills' } });
    expect(screen.getByTestId('dynamic-step')).toBeInTheDocument();
  });

  test('renders fallback UI for unknown step', () => {
    render(StepSwitcher, { props: { characterId, step: 'does-not-exist' } });
    expect(screen.getByText(/step not found/i)).toBeInTheDocument();
  });
});
