<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import {
    type FieldDefinition,
    type GroupFieldDefinition,
    SavageWorlds,
  } from '@automata/grimoire';
  import Button from '@smui/button';
  import { Cell } from '@smui/layout-grid';
  import { writable } from 'svelte/store';

  import { goto } from '$app/navigation';
  import Field from '$lib/components/wizard/Field.svelte';

  interface Props {
    characterId: string;
    step: string;
  }

  const { characterId, step }: Props = $props();

  // Create character state with default values
  const characterState = writable<Record<string, unknown>>({});

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

  function handleNextClick() {
    if (nextStep.key === 'Unknown') {
      goto(`/c/${characterId}?step=done`);
    } else {
      goto(`/c/${characterId}?step=${nextStep.key}`);
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

<Cell span={12}>
  <h2>Step: {currentStep.key}</h2>
  <form>
    {#each currentStep.fields as path (path)}
      <Field {characterState} fieldDef={getFieldDefFromPath(path)} {path} />
    {/each}
  </form>
  <div>
    <Button onclick={handlePrevClick}>Prev</Button>
    <Button onclick={handleNextClick}>Next</Button>
  </div>
</Cell>
