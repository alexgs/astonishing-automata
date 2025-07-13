/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render } from '@testing-library/svelte';
import { describe, expect, vi } from 'vitest';

import NavBar from './NavBar.svelte';

// Mock the UserButton component
vi.mock('$lib/components/UserButton.svelte', async () => {
  // @ts-expect-error -- Unresolved path to the mock component
  // eslint-disable-next-line import/no-unresolved
  const mod = await import('$__mocks__/$lib/components/UserButton.svelte');
  return { default: mod.default };
});

describe('NavBar Component', () => {
  it('renders the title', () => {
    const { getByText } = render(NavBar);
    expect(getByText('Automata Character Builder')).toBeInTheDocument();
  });

  it('includes the user button', () => {
    const { getByTestId } = render(NavBar);
    expect(getByTestId('mock-user-button')).toBeInTheDocument();
  });
});
