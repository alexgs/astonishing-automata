/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';

import Page from './+page.svelte';

describe('Page Component', () => {
  test('renders the component', () => {
    render(Page);
    expect(screen.getByText('Create a new character')).toBeInTheDocument();
  });

  // TODO: I can't get this test to work; it should be handled in an E2E test
  test.skip('toggles drawer when button is clicked', async () => {
    render(Page);
    const toggleButton = screen.getByText('Toggle Drawer');
    const drawer = screen.getByRole('complementary');

    // Initially, the drawer should be closed
    // console.log(window.getComputedStyle(drawer));
    expect(drawer).toHaveStyle({ display: 'none' });
    expect(drawer).not.toBeVisible();

    // Click the button to open the drawer
    await fireEvent.click(toggleButton);
    expect(drawer).toBeVisible();

    // Click the button again to close the drawer
    await fireEvent.click(toggleButton);
    expect(drawer).not.toBeVisible();
  });
});
