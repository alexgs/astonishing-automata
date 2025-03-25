/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';

import NavBar from './NavBar.svelte';

// Mock the UserButton component
vi.mock('$lib/components/UserButton.svelte', () => ({
  default: () => '<div data-testid="mock-user-button"></div>',
}));

describe('NavBar Component', () => {
  test('renders the component', () => {
    render(NavBar);
    expect(screen.getByText('Automata Character Builder')).toBeInTheDocument();
  });
});
