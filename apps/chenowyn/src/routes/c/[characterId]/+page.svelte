<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import LayoutGrid from '@smui/layout-grid';

  import StepSwitcher from '$lib/components/wizard/StepSwitcher.svelte';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let characterId = $derived(() => data.characterId);
  let step = $derived(() => data.step);
</script>

<LayoutGrid>
  <StepSwitcher characterId={characterId()} step={step()} />
</LayoutGrid>
