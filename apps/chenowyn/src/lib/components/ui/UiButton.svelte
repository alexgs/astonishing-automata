<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { Button } from "bits-ui";

  interface Props {
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'default' | 'pop' | 'primary';
  }

  let {
    children,
    disabled = false,
    onclick, type = 'button',
    variant = 'default',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: Props & { children?: any } = $props();
</script>

<style lang="scss">
  @use '$lib/styles/tokens';

  :global(.ui-button) {
    appearance: none;
    font: inherit;
    padding: 0.5rem 1rem;
    border: 1px solid var(--btn-border);
    background-color: var(--btn-fill);
    color: var(--btn-text);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.05s ease;

    &:hover:not(:disabled) {
      background-color: var(--btn-hover-fill);
      border-color: var(--btn-hover-border);
    }

    &:focus-visible {
      outline: 2px solid var(--btn-focus);
      outline-offset: 2px;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
      background-color: var(--btn-active-fill);
    }

    &:disabled {
      color: #999;
      border-color: #ddd;
      cursor: not-allowed;
      background-color: #f9f9f9;
    }
  }

  :global(.variant-primary) {
    --btn-border: #{tokens.$purple-9};
    --btn-fill: #{tokens.$purple-9};
    --btn-text: #fff;
    --btn-hover-fill: #{tokens.$purple-8};
    --btn-hover-border: #{tokens.$purple-7};
    --btn-active-fill: #{tokens.$purple-7};
    --btn-focus: #{tokens.$purple-6};
  }

  :global(.variant-pop) {
    --btn-border: #{tokens.$pink-9};
    --btn-fill: transparent;
    --btn-text: #{tokens.$pink-9};
    --btn-hover-fill: #{tokens.$pink-2};
    --btn-hover-border: #{tokens.$pink-7};
    --btn-active-fill: #{tokens.$pink-1};
    --btn-focus: #{tokens.$pink-6};
  }
</style>

<Button.Root type={type} class={`ui-button variant-${variant}`} {onclick} disabled={disabled}>
  {@render children()}
</Button.Root>
