<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { characterBuilderMachine } from '@automata/state-machine';
  import LayoutGrid from '@smui/layout-grid';
  import { useMachine } from '@xstate/svelte';

  import StepSwitcher from '$lib/components/steps/StepSwitcher.svelte';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let characterId = $derived(() => data.characterId);
  let stepName = $derived(() => data.stepName);

  const { snapshot, send } = useMachine(characterBuilderMachine);
</script>

<LayoutGrid>
  <StepSwitcher
    characterId={characterId()}
    {snapshot}
    {send}
    stepName={stepName()}
  />
</LayoutGrid>
