<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { SavageWorlds } from '@automata/grimoire';

  import FirstStep from '$lib/components/wizard/FirstStep.svelte';
  import DynamicStep from '$lib/components/wizard/DynamicStep.svelte';

  interface Props {
    characterId: string;
    step: string|null;
  }

  const { characterId, step }: Props = $props();

  const stepNames = SavageWorlds.steps.map((s) => s.key);
</script>

{#if step === null}
  <FirstStep characterId={characterId} />
{:else if stepNames.includes(step) }
  <DynamicStep {characterId} {step} />
{:else}
  <p>❌ Step not found "{step}"</p>
{/if}
