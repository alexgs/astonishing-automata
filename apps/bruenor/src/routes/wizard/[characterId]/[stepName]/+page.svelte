<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import { characterBuilderMachine } from '@automata/state-machine';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { page } from '$app/state';
  import { initialTransition, transition } from 'xstate';

  const { characterId, stepName } = page.params;

  const [initialState, initialActions] = initialTransition(characterBuilderMachine);
  console.log(initialState);
  console.log(initialActions);

  // TODO Eventually we'll need to use a different state than `initialState`
  const [nextState, actions] = transition(characterBuilderMachine, initialState, {
    type: 'start',
  });


</script>

<LayoutGrid>
  <Cell span={12}>
    <p>Character ID: {characterId}</p>
    <p>Step name: {stepName}</p>
  </Cell>
</LayoutGrid>
