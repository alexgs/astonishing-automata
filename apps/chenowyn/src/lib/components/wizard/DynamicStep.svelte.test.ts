/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi } from 'vitest';

import { patchCharacter } from '$lib/services/character-service';

import DynamicStep from './DynamicStep.svelte';

// eslint-disable-next-line import/no-unresolved
import { goto } from '$app/navigation';

vi.mock('$lib/services/character-service', () => ({
  patchCharacter: vi.fn(() => Promise.resolve()),
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

vi.mock('$lib/components/wizard/Field.svelte', async () => {
  // @ts-expect-error -- Unresolved path to the mock component
  // eslint-disable-next-line import/no-unresolved
  const mod = await import('$__mocks__/$lib/components/wizard/Field.svelte');
  return { default: mod.default };
});

// Inject fake SavageWorlds definition
vi.mock('@automata/grimoire', async () => {
  const actual = await vi.importActual<typeof import('@automata/grimoire')>('@automata/grimoire');
  return {
    ...actual,
    SavageWorlds: {
      steps: [
        {
          key: 'step1',
          fields: [ 'attributes.strength' ],
        },
        {
          key: 'step2',
          fields: [ 'edges.alertness' ],
        },
      ],
      character: {
        attributes: {
          type: 'group',
          fields: {
            strength: {
              key: 'strength',
              type: 'number',
            },
          },
        },
        edges: {
          type: 'group',
          fields: {
            alertness: {
              key: 'alertness',
              type: 'boolean',
            },
          },
        },
      },
    },
  };
});

describe('DynamicStep', () => {
  const characterId = 'abc123';

  test('renders current step name and field(s)', () => {
    render(DynamicStep, { props: { characterId, step: 'step1' } });

    expect(screen.getByText('Step: step1')).toBeInTheDocument();
    expect(screen.getByTestId('mock-field')).toBeInTheDocument();
  });

  test('clicking Next calls patchCharacter and navigates to next step', async () => {
    render(DynamicStep, { props: { characterId, step: 'step1' } });

    const nextButton = screen.getByText('Next');
    await fireEvent.click(nextButton);

    expect(patchCharacter).toHaveBeenCalledWith(characterId);
    expect(goto).toHaveBeenCalledWith(`/c/${characterId}?step=step2`);
  });

  test('clicking Next on final step navigates to done', async () => {
    render(DynamicStep, { props: { characterId, step: 'step2' } });

    const nextButton = screen.getByText('Next');
    await fireEvent.click(nextButton);

    expect(patchCharacter).toHaveBeenCalledWith(characterId);
    expect(goto).toHaveBeenCalledWith(`/c/${characterId}?step=done`);
  });

  test('clicking Prev on second step navigates to previous step', async () => {
    render(DynamicStep, { props: { characterId, step: 'step2' } });

    const prevButton = screen.getByText('Prev');
    await fireEvent.click(prevButton);

    expect(goto).toHaveBeenCalledWith(`/c/${characterId}?step=step1`);
  });

  test('clicking Prev on first step navigates to character root', async () => {
    render(DynamicStep, { props: { characterId, step: 'step1' } });

    const prevButton = screen.getByText('Prev');
    await fireEvent.click(prevButton);

    expect(goto).toHaveBeenCalledWith(`/c/${characterId}`);
  });

  test('errors in patchCharacter are caught and logged', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });
    (patchCharacter as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('fail'));

    render(DynamicStep, { props: { characterId, step: 'step1' } });

    const nextButton = screen.getByText('Next');
    await fireEvent.click(nextButton);

    expect(consoleSpy).toHaveBeenCalledWith('Error patching character:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
