<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import { characterBuilderMachine } from '@automata/state-machine';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { page } from '$app/state';
  import { initialTransition, transition } from 'xstate';

  const { characterId, stepName } = page.params;

  const stateNode = characterBuilderMachine.getStateNodeById(`${characterBuilderMachine.id}.${stepName}`);
  const validEvents = Object.keys(stateNode.on);

  // TODO Eventually we'll need to use a different state than `initialState`
  const [initialState] = initialTransition(characterBuilderMachine);
  const nextStep = validEvents
    .map((event) => {
      const [nextState] = transition(characterBuilderMachine, initialState, {
        type: event,
      });
      return {
        event,
        nextStep: nextState.value,
      };
    })
    .filter((step) => step.nextStep !== stepName)
    .at(0);
  console.log(`Next step: ${JSON.stringify(nextStep)}`);
</script>

<LayoutGrid>
  <Cell span={12}>
    <p>Character ID: {characterId}</p>
    <p>Step name: {stepName}</p>
  </Cell>
</LayoutGrid>
