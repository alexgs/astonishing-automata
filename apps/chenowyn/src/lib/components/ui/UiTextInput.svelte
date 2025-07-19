<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  interface Props {
    disabled?: boolean;
    error: string | null;
    label: string;
    name: string;
    onInput: (value: string) => void;
    placeholder?: string;
    value: string;
  }

  let {
    disabled = false,
    error,
    label,
    name,
    onInput,
    placeholder = '',
    value,
  }: Props = $props();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    onInput(target.value);
  }
</script>

<style lang="scss">
  @use '$lib/styles/tokens';

  .ui-field {
    display: flex;
    flex-direction: column;
    gap: tokens.$space-small;
  }

  .ui-label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    font-size: tokens.$font-size-sm;
    color: tokens.$color-text;
  }

  input {
    margin-top: tokens.$space-xsmall;
    padding: tokens.$space-small tokens.$space-medium;
    font-size: tokens.$font-size-md;
    color: tokens.$color-text;
    background-color: tokens.$color-bg;
    border: 1px solid tokens.$color-border;
    border-radius: tokens.$border-radius;

    &:focus {
      outline: 2px solid tokens.$color-primary;
      outline-offset: 2px;
    }

    &.invalid {
      border-color: tokens.$color-danger;
    }
  }

  .ui-error {
    font-size: tokens.$font-size-xs;
    color: tokens.$color-danger;
  }
</style>

<div class="ui-field">
  <label class="ui-label" for={name}>
    {label}
    <input
      class:invalid={!!error}
      id={name}
      name={name}
      type="text"
      value={value}
      placeholder={placeholder}
      oninput={handleInput}
      disabled={disabled}
    />
  </label>
  {#if error}
    <div class="ui-error">{error}</div>
  {/if}
</div>

