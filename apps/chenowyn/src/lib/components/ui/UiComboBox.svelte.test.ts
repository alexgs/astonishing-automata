/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// IMPORTANT: mock the resizeObserver action so we can assert the style width easily.
vi.mock('$lib/actions/resize-observer.svelte', async () => {
  // a Svelte action signature: (node: HTMLElement, cb: (rect: DOMRectReadOnly)=>void)
  // Call the provided callback immediately with a fake width.
  const resizeObserver = (node: HTMLElement, cb: (rect: DOMRectReadOnly) => void) => {
    // minimal shape that your component expects
    cb({ width: 240 } as DOMRectReadOnly);
    return { destroy() {} };
  };
  return { resizeObserver };
});

// If Bits UI uses portals, jsdom is fine; we’ll just query document.body.

import UiComboBox from './UiComboBox.svelte';

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Apricot', value: 'apricot' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
];

function setup(props?: Partial<Parameters<typeof UiComboBox>['0']>) {
  const onSelect = vi.fn();
  const utils = render(UiComboBox, {
    props: {
      disabled: false,
      options: OPTIONS,
      placeholder: 'Select an option',
      onSelect,
      ...props,
    },
  });
  const input = screen.getByPlaceholderText('Select an option') as HTMLInputElement;
  const trigger = screen.getByRole('button', { name: /▼/ });
  return { ...utils, input, trigger, onSelect };
}

async function openList(trigger: HTMLElement) {
  await userEvent.click(trigger);
  // Content may be in a portal; just wait for any known item to appear.
  await screen.findByText('Apple');
}

describe('UiComboBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder and applies width from resize observer', async () => {
    const { input, trigger } = setup();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Select an option');

    await openList(trigger);
    // The content div with inline style is inside Combobox.Content; look for it near items.
    // We can find the container that holds items by traversing from one item:
    const apple = await screen.findByText('Apple');
    expect(apple).toBeInTheDocument();

    // const itemsContainer = apple.closest('div'); // your code puts {style} on this wrapper div
    const itemsContainer = screen.getByTestId('combobox-items');
    expect(itemsContainer).toBeInTheDocument();
    expect(itemsContainer).toHaveAttribute('style', expect.stringContaining('--combobox-width: 240px'));
  });

  it('filters options as the user types', async () => {
    const { input, trigger } = setup();
    await openList(trigger);

    await userEvent.type(input, 'ap');
    // Both Apple and Apricot remain; Banana should not.
    expect(await screen.findByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Apricot')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('shows empty state when no results match', async () => {
    const { input, trigger } = setup();
    await openList(trigger);

    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(await screen.findByText('No results found')).toBeInTheDocument();
  });

  it('selects an option via mouse and calls onSelect with value', async () => {
    const { trigger, onSelect } = setup();
    onSelect.mockReset();
    await openList(trigger);

    await userEvent.click(screen.getByText('Blueberry'));
    // your snippet renders a "✅" when selected; not required for this assert, but nice to have:
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('blueberry');
  });

  it('selects via keyboard (ArrowDown + Enter) and fires onSelect once', async () => {
    const { input, trigger, onSelect } = setup();
    onSelect.mockReset();
    await openList(trigger);

    // focus input and navigate
    input.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    // Arrow-down selects the second item (Apricot)
    expect(onSelect).toHaveBeenCalledWith('apricot');
  });

  it('clears the search when the list closes (handleOpenChange)', async () => {
    const { input, trigger } = setup();
    await openList(trigger);

    await userEvent.type(input, 'ap');
    // close by toggling the trigger
    await userEvent.click(trigger);

    // When closed, the onOpenChange(false) should reset searchValue = ''
    // Re-open and ensure full list is back (Banana present).
    await openList(trigger);
    expect(screen.getByText('Banana')).toBeInTheDocument();

    // Also verify the actual input is cleared
    expect(input.value).toBe('');
  });

  it('respects the disabled prop (input and trigger not interactive)', async () => {
    // @ts-expect-error -- doesn't recognize `disabled` as a valid prop
    const { input, trigger } = setup({ disabled: true });

    expect(input).toBeDisabled();
    expect(trigger).toBeDisabled();

    // Attempts to open should not show options
    await userEvent.click(trigger);
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });
});
