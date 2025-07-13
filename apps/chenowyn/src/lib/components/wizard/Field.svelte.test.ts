/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { type FieldDefinition, evaluateField as realEvaluateField } from '@automata/grimoire';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { type Mock, vi } from 'vitest';

import Field from './Field.svelte';

const evaluateField = realEvaluateField as unknown as Mock;

vi.mock('@automata/grimoire', async () => {
  const actual = await vi.importActual<typeof import('@automata/grimoire')>('@automata/grimoire');

  return {
    ...actual,
    evaluateField: vi.fn(() => ({ result: true, violations: [] })),
  };
});

vi.mock('$lib/stores/character-store', () => ({
  updateField: vi.fn(),
  getCharacterState: vi.fn(() => ({}))
}));

const mockFieldDef: FieldDefinition = {
  key: 'strength',
  type: 'number'
};

describe('`Field` component', () => {
  it('renders label with path', () => {
    render(Field, { props: { fieldDef: mockFieldDef, path: 'attributes.strength' } });
    expect(screen.getByLabelText('attributes.strength')).toBeInTheDocument();
  });

  it('coerces input value and updates store', async () => {
    const { getByLabelText } = render(Field, {
      props: { fieldDef: mockFieldDef, path: 'attributes.strength' }
    });

    const input = getByLabelText('attributes.strength');
    await fireEvent.input(input, { target: { value: '12' } });

    const { updateField } = await import('$lib/stores/character-store');
    expect(updateField).toHaveBeenCalledWith('attributes.strength', 12);
  });

  it('shows error when constraint fails', async () => {
    evaluateField.mockReturnValueOnce({
      result: false,
      violations: [{ reason: 'Too strong!' }]
    });

    const { getByLabelText, findByText } = render(Field, {
      props: { fieldDef: mockFieldDef, path: 'attributes.strength' }
    });

    const input = getByLabelText('attributes.strength');
    await fireEvent.input(input, { target: { value: '99' } });

    expect(await findByText('Too strong!')).toBeInTheDocument();
  });
});
