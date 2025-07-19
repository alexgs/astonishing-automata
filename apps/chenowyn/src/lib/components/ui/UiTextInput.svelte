<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  interface Props {
    disabled?: boolean;
    error: string | null;
    label: string;
    layout?: 'vertical' | 'horizontal';
    name: string;
    onInput: (event: Event) => void;
    placeholder?: string;
    value: string;
  }

  let {
    disabled = false,
    error,
    label,
    layout = 'vertical',
    name,
    onInput,
    placeholder = '',
    value,
  }: Props = $props();

  function handleInput(event: Event) {
    onInput(event);
  }
</script>

<style lang="scss">
  @use '$lib/styles/tokens';

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

  .input-container {
    display: flex;
    flex-direction: column;
    gap: tokens.$space-xsmall;
    width: 100%;
  }

  .ui-field {
    display: flex;
    flex-direction: column;
    gap: tokens.$space-small;

    &.horizontal {
      flex-direction: row;
      align-items: center;

      .ui-label {
        margin: 0;
        min-width: 4rem;
      }

      input {
        flex: 1;
        margin-top: 0;
      }
    }
  }

  .ui-label {
    font-weight: 500;
    font-size: tokens.$font-size-sm;
    color: tokens.$color-text;
    text-align: right;
  }

  .ui-error {
    font-size: tokens.$font-size-xs;
    color: tokens.$color-danger;
  }
</style>

<div class="ui-field" class:horizontal={layout === 'horizontal'}>
  <label class="ui-label" for={name}>
    {label}
  </label>
  <div class="input-container">
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
    {#if error}
      <div class="ui-error">{error}</div>
    {/if}
  </div>
</div>

