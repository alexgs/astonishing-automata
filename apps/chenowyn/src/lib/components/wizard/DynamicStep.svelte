<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { Cell } from '@smui/layout-grid';
  import {
    type FieldDefinition,
    type GroupFieldDefinition,
    SavageWorlds,
  } from '@automata/grimoire';
  import Field from '$lib/components/Field.svelte';
  import { writable } from 'svelte/store';

  interface Props {
    characterId: string;
    step: string;
  }

  const { characterId, step }: Props = $props();

  // Create character state with default values
  const characterState = writable<Record<string, unknown>>({});

  // We change steps by reloading this component, so this should be fine
  const currentStep = SavageWorlds.steps.find(s => s.key === step) ?? { key: 'Unknown', fields: [] };

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

</script>

<Cell span={12}>
  <h2>Step: {currentStep.key}</h2>
  <form>
    {#each currentStep.fields as path (path)}
      <Field {characterState} fieldDef={getFieldDefFromPath(path)} {path} />
    {/each}
  </form>
</Cell>
