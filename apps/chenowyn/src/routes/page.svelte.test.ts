/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { describe, test, expect, vi } from 'vitest';

import Page from './+page.svelte';

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

vi.mock('$lib/clerk', () => ({
  auth: {
    session: readable({
      getToken: vi.fn(() => Promise.resolve('mock-token')),
    }),
  },
}));

vi.mock('$lib/config', () => ({
  config: { apiHost: 'mock-host.test' }
}));

describe('Homepage component', () => {
  test('renders the homepage', () => {
    render(Page);
    expect(screen.getByText('Create a new character')).toBeInTheDocument();
  });

  test('creates a character and navigates', async () => {
    const fetchMock = vi.fn(() =>
      new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            ok: true,
            json: () => Promise.resolve({ data: { characterId: 'abc123' } }),
          }), 2000)
      )
    );
    global.fetch = fetchMock as typeof global.fetch;

    const { getByRole } = render(Page);
    const button = getByRole('button', { name: 'Create a new character' });

    await fireEvent.click(button);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(button).toBeDisabled();
    });
  });
});
