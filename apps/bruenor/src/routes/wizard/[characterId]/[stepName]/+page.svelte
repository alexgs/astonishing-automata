<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import {
    STEPS,
    type StepName,
    characterBuilderMachine,
    getNextSteps,
  } from '@automata/state-machine';
  import LayoutGrid from '@smui/layout-grid';
  import { useMachine } from '@xstate/svelte';
  import { initialTransition } from 'xstate';

  import { page } from '$app/state';
  import SelectClass from '$lib/components/steps/SelectClass.svelte';
  import SelectSpecies from '$lib/components/steps/SelectSpecies.svelte';

  const { characterId, stepName } = page.params;

  const { snapshot, send } = useMachine(characterBuilderMachine);

  const stepComponentMap = {
    [STEPS.SELECT_SPECIES]: SelectSpecies,
    [STEPS.SELECT_CLASS]: SelectClass,
    [STEPS.SELECT_SUBCLASS]: SelectClass,
    [STEPS.SELECT_CLASS_FEATURES]: SelectClass,
    [STEPS.CHOOSE_ABILITY_SCORE_METHOD]: SelectClass,
    [STEPS.ABILITY_SCORE_STANDARD]: SelectClass,
    [STEPS.ABILITY_SCORE_POINT_BUY]: SelectClass,
    [STEPS.ABILITY_SCORE_ROLLED]: SelectClass,
    [STEPS.SELECT_BACKGROUND]: SelectClass,
    [STEPS.SELECT_BACKGROUND_FEATURES]: SelectClass,
    [STEPS.CHOOSE_EQUIPMENT_METHOD]: SelectClass,
    [STEPS.EQUIPMENT_STARTING]: SelectClass,
    [STEPS.EQUIPMENT_GOLD_BUY]: SelectClass,
    [STEPS.SELECT_SPELLS]: SelectClass,
    [STEPS.FINAL_REVIEW]: SelectClass,
    [STEPS.FINISH]: SelectClass,
  };

  const StepComponent = stepComponentMap[stepName as StepName];

  // TODO Eventually we'll need to use a different state than `initialState`
  const [initialState] = initialTransition(characterBuilderMachine);
  const nextSteps = getNextSteps(characterBuilderMachine, initialState, stepName);
  console.log(`Next steps: ${JSON.stringify(nextSteps, null, 2)}`);
</script>

<LayoutGrid>
  {#if StepComponent}
    <svelte:component this={StepComponent} snapshot={snapshot} {send} {characterId} />
  {:else}
    <p>Step not found: {stepName}</p>
  {/if}
</LayoutGrid>
