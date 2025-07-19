<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
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

  .ui-button {
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
      color: var(--btn-hover-text);
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

  .variant-primary {
    --btn-active-fill: #{tokens.$teal-7};
    --btn-border: #{tokens.$brand-accent};
    --btn-fill: #{tokens.$brand-accent};
    --btn-focus: #{tokens.$teal-6};
    --btn-hover-border: #{tokens.$teal-7};
    --btn-hover-fill: #{tokens.$teal-8};
    --btn-text: #fff;
  }

  .variant-pop {
    --btn-active-fill: #{tokens.$teal-1};
    --btn-border: #{tokens.$brand-accent};
    --btn-fill: transparent;
    --btn-focus: #{tokens.$teal-6};
    --btn-hover-border: #{tokens.$brand-accent-hover};
    --btn-hover-fill: #{tokens.$teal_4};
    --btn-text: #{tokens.$brand-accent};
  }
</style>

<button type={type} class={`ui-button variant-${variant}`} {onclick} disabled={disabled}>
  {@render children()}
</button>
