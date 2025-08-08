/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { beforeAll, vi } from 'vitest';

import { patchCharacter } from '$lib/services/character-service';
import { updateField } from '$lib/stores/character-store';

import FirstStep from './FirstStep.svelte';

// eslint-disable-next-line import/no-unresolved
import { goto } from '$app/navigation';

vi.mock('$lib/services/character-service', () => ({
  patchCharacter: vi.fn(() => Promise.resolve())
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

vi.mock('$lib/stores/character-store', () => ({
  characterState: readable({ name: 'Fizzleboom' }),
  updateField: vi.fn(),
}));

vi.mock('@automata/grimoire', async () => {
  const actual = await vi.importActual<typeof import('@automata/grimoire')>('@automata/grimoire');
  return {
    ...actual,
    SavageWorlds: {
      steps: [
        { key: 'attributes', fields: ['attributes.strength'] }
      ]
    }
  };
});

describe('`FirstStep` component', () => {
  beforeAll(() => {
    class MockResizeObserver {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      constructor(_: ResizeObserverCallback) {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }

    global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  });
  const characterId = 'abc123';

  test.skip('updates name field on input', async () => {
    render(FirstStep, { props: { characterId } });

    const input = screen.getByLabelText('Character Name');
    await fireEvent.input(input, { target: { value: 'Valkyrie' } });

    expect(updateField).toHaveBeenCalledWith('name', 'Valkyrie');
  });

  test('calls patchCharacter and navigates to first step on submit', async () => {
    render(FirstStep, { props: { characterId } });

    const button = screen.getByRole('button', { name: 'Next' });
    await fireEvent.click(button);

    expect(patchCharacter).toHaveBeenCalledWith(characterId);
    expect(goto).toHaveBeenCalledWith(`/c/${characterId}?step=attributes`);
  });

  test('disables button and shows "Saving…" while saving', async () => {
    // simulate delayed patchCharacter
    (patchCharacter as ReturnType<typeof vi.fn>).mockImplementationOnce(() => new Promise(() => {}));

    render(FirstStep, { props: { characterId } });

    const button = screen.getByRole('button', { name: 'Next' });
    await fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(await screen.findByText('Saving…')).toBeInTheDocument();
  });

  test('shows error message if patchCharacter fails', async () => {
    const error = new Error('Server blew up');
    (patchCharacter as ReturnType<typeof vi.fn>).mockRejectedValueOnce(error);

    render(FirstStep, { props: { characterId } });

    const button = screen.getByRole('button', { name: 'Next' });
    await fireEvent.click(button);

    expect(await screen.findByText('Server blew up')).toBeInTheDocument();
  });
});
