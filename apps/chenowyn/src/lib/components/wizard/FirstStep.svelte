<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { SavageWorlds } from '@automata/grimoire';

  import { goto } from '$app/navigation';
  import UiButton from '$lib/components/ui/UiButton.svelte';
  import { patchCharacter } from '$lib/services/character-service';
  import { characterState, updateField } from '$lib/stores/character-store';
  import UiComboBox from '$lib/components/ui/UiComboBox.svelte';
  import UiFieldGroup from '$lib/components/ui/UiFieldGroup.svelte';
  import UiFormContainer from '$lib/components/ui/UiFormContainer.svelte';
  import UiTextInput from '$lib/components/ui/UiTextInput.svelte';

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

  const options = [
    { label: 'System 1', value: 'system1' },
    { label: 'System 2', value: 'system2' },
    { label: 'System 3', value: 'system3' }
  ];

  function onSelect(system: string) {
    console.log(`>> Selected system: ${system}`);
  }
</script>

<UiFormContainer>
  <UiFieldGroup layout="horizontal" title="Select System">
    <UiComboBox {options} {onSelect} />
  </UiFieldGroup>
  <UiFieldGroup layout="horizontal" title="New Savage Worlds Character">
    <UiTextInput
      label="Character Name"
      name="characterName"
      value={name}
      onInput={handleInput}
      error={error}
    />
  </UiFieldGroup>
  <UiButton disabled={isSaving} onclick={submitName} variant="primary">
    { isSaving ? 'Saving…' : 'Next' }
  </UiButton>
</UiFormContainer>
