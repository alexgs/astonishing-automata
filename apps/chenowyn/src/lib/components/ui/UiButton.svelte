<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  interface Props {
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    type?: 'button' | 'submit' | 'reset';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { children, disabled = false, onclick, type = 'button' }: Props & { children?: any } = $props();
</script>

<style lang="scss">
  .ui-button {
    appearance: none;
    font: inherit;
    padding: 0.5rem 1rem;
    border: 1px solid var(--btn-outline-border);
    background-color: var(--btn-outline-fill);
    color: var(--btn-outline-text);
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.05s ease;

    &:hover:not(:disabled) {
      background-color: var(--btn-outline-hover-fill);
      border-color: var(--btn-outline-hover-border);
    }

    &:focus-visible {
      outline: 2px solid var(--btn-outline-focus);
      outline-offset: 2px;
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
      background-color: var(--btn-outline-active-fill);
    }

    &:disabled {
      color: #999;
      border-color: #ddd;
      cursor: not-allowed;
      background-color: #f9f9f9;
    }
  }
</style>

<button type={type} class="ui-button" {onclick} disabled={disabled}>
  {@render children()}
</button>
