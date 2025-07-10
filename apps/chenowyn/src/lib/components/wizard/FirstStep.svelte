<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { SavageWorlds } from '@automata/grimoire';
  import { Cell } from '@smui/layout-grid';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';

  import { goto } from '$app/navigation';
  import { patchCharacter } from '$lib/services/character-service';
  import { characterState, updateField } from '$lib/stores/character-store';

  interface Props {
    characterId: string;
  }

  const { characterId }: Props = $props()

  let isSaving = $state(false);
  let error = $state<string | null>(null);

  let name: string = $derived($characterState.name as string ?? '');

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    updateField('name', input.value);
  }

  async function submitName() {
    isSaving = true;
    error = null;
    try {
      await patchCharacter(characterId);
      await goto(`/c/${characterId}?step=${SavageWorlds.steps[0].key}`);
    } catch (err) {
      if (err instanceof Error) {
        error = err.message || 'Unexpected error';
      } else {
        error = 'An unknown error occurred';
      }
    } finally {
      isSaving = false;
    }
  }
</script>

<Cell span={12}>
  <p>Character ID: {characterId}</p>
</Cell>
<Cell span={12}>
  <TextField
    bind:value={name}
    label="Character Name"
    oninput={handleInput}
  />
</Cell>
<Cell span={12}>
  <Button disabled={isSaving} onclick={submitName}>
    { isSaving ? 'Saving…' : 'Next' }
  </Button>
</Cell>
{#if error}
  <Cell span={12}>
    <p style="color: red;">{error}</p>
  </Cell>
{/if}
