<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import {
    type FieldDefinition,
    type GroupFieldDefinition,
    SavageWorlds,
  } from '@automata/grimoire';

  import { goto } from '$app/navigation';
  import UiButton from '$lib/components/ui/UiButton.svelte';
  import UiFieldGroup from '$lib/components/ui/UiFieldGroup.svelte';
  import Field from '$lib/components/wizard/Field.svelte';
  import { patchCharacter } from '$lib/services/character-service';
  import { getCharacterState } from '$lib/stores/character-store';
  import UiFormContainer from '$lib/components/ui/UiFormContainer.svelte';

  interface Props {
    characterId: string;
    step: string;
  }

  const { characterId, step }: Props = $props();

  const currentStepIndex = $derived(SavageWorlds.steps.findIndex(s => s.key === step) ?? { key: 'Unknown', fields: [] });
  const prevStep = $derived(SavageWorlds.steps[currentStepIndex - 1] ?? { key: 'Unknown', fields: [] });
  const currentStep = $derived(SavageWorlds.steps[currentStepIndex]);
  const nextStep = $derived(SavageWorlds.steps[currentStepIndex + 1] ?? { key: 'Unknown', fields: [] });

  function getFieldDefFromPath(path: string): FieldDefinition {
    const segments = path.split('.');
    let node = SavageWorlds.character[segments[0]];
    if (!node) {
      throw new Error(`Field definition not found for path: ${path}`);
    }

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      if (!node) {
        throw new Error(`Field definition not found for path: ${path}`);
      }

      if (node.type === 'group') {
        const group = node as GroupFieldDefinition;
        node = group.fields?.[segment];
      }
    }

    return node as FieldDefinition;
  }

  async function handleNextClick() {
    try {
      await patchCharacter(characterId);
      if (nextStep.key === 'Unknown') {
        goto(`/c/${characterId}?step=done`);
      } else {
        goto(`/c/${characterId}?step=${nextStep.key}`);
      }
    } catch (error) {
      console.error('Error patching character:', error);
    }
  }

  function handlePrevClick() {
    if (prevStep.key === 'Unknown') {
      goto(`/c/${characterId}`);
    } else {
      goto(`/c/${characterId}?step=${prevStep.key}`);
    }
  }
</script>

<UiFormContainer>
  <h2>Name: {`${getCharacterState().name} [Savage Worlds]`}</h2>
  <UiFieldGroup layout="horizontal" title={`Step: ${currentStep.key}`}>
    {#each currentStep.fields as path (path)}
      <Field fieldDef={getFieldDefFromPath(path)} {path} />
    {/each}
  </UiFieldGroup>
  <div>
    <UiButton onclick={handlePrevClick}>Prev</UiButton>
    <UiButton onclick={handleNextClick}>Next</UiButton>
  </div>
</UiFormContainer>
