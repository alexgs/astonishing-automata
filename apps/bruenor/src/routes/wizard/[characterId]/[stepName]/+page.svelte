<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import {
    characterBuilderMachine,
    getNextSteps,
  } from '@automata/state-machine';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { page } from '$app/state';
  import { initialTransition } from 'xstate';

  const { characterId, stepName } = page.params;

  // TODO Eventually we'll need to use a different state than `initialState`
  const [initialState] = initialTransition(characterBuilderMachine);
  const nextSteps = getNextSteps(characterBuilderMachine, initialState, stepName);
  console.log(`Next steps: ${JSON.stringify(nextSteps, null, 2)}`);
</script>

<LayoutGrid>
  <Cell span={12}>
    <p>Character ID: {characterId}</p>
    <p>Step name: {stepName}</p>
  </Cell>
</LayoutGrid>
