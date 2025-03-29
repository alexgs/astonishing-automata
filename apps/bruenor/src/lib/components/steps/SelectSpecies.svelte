<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import {
    ACTIONS,
    STEPS,
    characterBuilderMachine,
    getNextSteps,
  } from '@automata/state-machine';
  import Button from '@smui/button';
  import FormField from '@smui/form-field';
  import { Cell } from '@smui/layout-grid';
  import Radio from '@smui/radio';
  import type { Readable } from 'svelte/store';
  import type { AnyMachineSnapshot, AnyEventObject } from 'xstate';
  import { goto } from '$app/navigation';

  interface Props {
    characterId: string;
    send: (event: AnyEventObject) => void;
    snapshot: Readable<AnyMachineSnapshot>;
  }

  const { characterId, send, snapshot }: Props = $props();

  console.log(`Value: ${$snapshot.value}`);
  const nextSteps = getNextSteps(characterBuilderMachine, $snapshot, $snapshot.value);
  console.log(`Next steps: ${JSON.stringify(nextSteps, null, 2)}`);

  let selectedSpecies: string = $state($snapshot.context.species ?? '');
  const availableSpecies = ['Elf', 'Dwarf', 'Human', 'Orc']; // Replace with real list

  function handleSubmit() {
    if (!selectedSpecies) return;

    send({ type: ACTIONS.SELECT_SPECIES, species: selectedSpecies });
    send({ type: STEPS.SELECT_CLASS }); // Transition to next step

    goto(`/wizard/${characterId}/${STEPS.SELECT_CLASS}`);
  }
</script>

<Cell span={12}>
  <h2>Select Your Species</h2>

  {#each availableSpecies as species (species)}
    <FormField>
      <Radio
        bind:group={selectedSpecies}
        value={species}
      />
      {species}
    </FormField>
  {/each}

  <Button onclick={handleSubmit} disabled={!selectedSpecies} variant="outlined">
    Continue
  </Button>
</Cell>
