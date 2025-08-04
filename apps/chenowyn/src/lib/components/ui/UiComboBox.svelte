<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { Combobox } from "bits-ui";

  interface Props {
    options: { label: string; value: string }[];
    disabled?: boolean;
  }

  let {
    options,
    disabled = false,
  }: Props = $props();

  let searchValue = $state("");

  const filteredItems = $derived.by(() => {
    if (searchValue === "") return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    searchValue = e.currentTarget.value;
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) searchValue = "";
  }
</script>

<Combobox.Root
  {disabled}
  type="single"
  items={options}
  onOpenChange={handleOpenChange}
>
  <Combobox.Input oninput={handleInput} />
  <Combobox.Trigger>Open</Combobox.Trigger>
  <Combobox.Portal>
    <Combobox.Content>
      {#each filteredItems as item, i (i + item.value)}
        <Combobox.Item {...item}>
          {#snippet children({ selected })}
            {item.label}
            {selected ? "✅" : ""}
          {/snippet}
        </Combobox.Item>
      {:else}
        <span> No results found </span>
      {/each}
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
