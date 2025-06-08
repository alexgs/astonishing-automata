<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { type StepName, STEPS } from '@automata/state-machine';
  import SelectSpecies from '$lib/components/steps/SelectSpecies.svelte';
  import SelectClass from '$lib/components/steps/SelectClass.svelte';
  import { type AnyEventObject, type AnyMachineSnapshot } from 'xstate';
  import type { Readable } from 'svelte/store';

  interface Props {
    characterId: string;
    send: (event: AnyEventObject) => void;
    snapshot: Readable<AnyMachineSnapshot>;
    stepName: string;
  }

  const { characterId, send, snapshot, stepName }: Props = $props();

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

  const StepComponent = $derived(stepComponentMap[stepName as StepName]);
</script>

{#if StepComponent}
  <StepComponent {snapshot} {send} {characterId} />
{:else}
  <p>Step not found: {stepName}</p>
{/if}
