<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { Combobox } from 'bits-ui';

  import { resizeObserver } from '$lib/actions/resize-observer.svelte';

  import './UiComboBox.scss';

  interface Props {
    disabled?: boolean;
    onSelect: (value: string) => void;
    options: { label: string; value: string }[];
    placeholder?: string;
  }

  let {
    disabled = false,
    onSelect,
    options,
    placeholder = 'Select an option',
  }: Props = $props();

  let searchValue = $state('');
  let value: string | undefined = $state(undefined);
  let width = $state(0);

  $effect(() => {
    if (value !== undefined) {
      onSelect(value);
    }
  });

  const filteredItems = $derived.by(() => {
    if (searchValue === '') return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase()),
    );
  });

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    searchValue = e.currentTarget.value;
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) searchValue = '';
  }

  const handleResize = (rect: DOMRectReadOnly) => {
    width = rect.width;
  };

  const style = $derived.by(() => {
    return `--combobox-width: ${width}px;`;
  });
</script>

<!-- Some styles are scoped (below); others are global (sibling .scss file) -->
<style lang="scss">
  @use '$lib/styles/tokens';

  .ui-combobox {
    display: flex;
    flex-direction: column;
    width: 100%;

    .input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid tokens.$brand-border;
      border-radius: 6px;
      padding: 0.5rem;
      background-color: tokens.$brand-surface;
    }

    .input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--token-text, #fff);
      font-size: 1rem;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: var(--token-muted, #888);
      }
    }

    .item {
      background: black;
    }

    .trigger {
      margin-left: 0.5rem;
      background: none;
      border: none;
      color: var(--token-accent, #00ffe3);
      cursor: pointer;

      &:hover {
        color: var(--token-accent-hover, #22fff0);
      }
    }
  }
</style>

<div
  use:resizeObserver={handleResize}
  class="ui-combobox"
>
  <Combobox.Root
    bind:value
    {disabled}
    type="single"
    items={options}
    onOpenChange={handleOpenChange}
  >
    <div class="input-wrapper">
      <Combobox.Input oninput={handleInput} {placeholder}>
        {#snippet child({ props })}
          <input {...props} class="input" />
        {/snippet}
      </Combobox.Input>
      <Combobox.Trigger>
        {#snippet child({ props })}
          <button {...props} class="trigger">
            <span>▼</span>
          </button>
        {/snippet}
      </Combobox.Trigger>
    </div>
    <Combobox.Portal>
      <Combobox.Content class="ui-combobox-content">
        <div {style} data-testid="combobox-items">
          {#each filteredItems as item, i (i + item.value)}
            <Combobox.Item {...item} class="item">
              {#snippet children({ selected })}
                {item.label}
                {selected ? "✅" : ""}
              {/snippet}
            </Combobox.Item>
          {:else}
            <span class="empty-message">No results found</span>
          {/each}
        </div>
      </Combobox.Content>
    </Combobox.Portal>
  </Combobox.Root>
</div>
