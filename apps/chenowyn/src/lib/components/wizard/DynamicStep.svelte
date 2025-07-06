<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { Cell } from '@smui/layout-grid';
  import { SavageWorlds } from '@automata/grimoire';

  interface Props {
    characterId: string;
    step: string;
  }

  const { characterId, step }: Props = $props()
  const currentStep = SavageWorlds.steps.find(s => s.key === step) ?? { key: 'Unknown' };
</script>

<Cell span={12}>
  <h2>Step: {currentStep.key}</h2>
  <p>Character ID: {characterId}</p>
  <p>👋 Hello step {step}</p>
</Cell>
