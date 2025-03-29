<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { Cell } from '@smui/layout-grid';
  import type { Readable } from 'svelte/store';
  import type { AnyMachineSnapshot, EventObject } from 'xstate';
  import {
    characterBuilderMachine,
    getNextSteps,
  } from '@automata/state-machine';

  interface Props {
    characterId: string;
    send: (event: EventObject) => void;
    snapshot: Readable<AnyMachineSnapshot>;
  }

  const { characterId, send, snapshot }: Props = $props();

  console.log(`Value: ${$snapshot.value}`);
  const nextSteps = getNextSteps(characterBuilderMachine, $snapshot, $snapshot.value);
  console.log(`Next steps: ${JSON.stringify(nextSteps, null, 2)}`);
</script>

<Cell span={12}>
  <p>Select species</p>
</Cell>
