<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import LayoutGrid, { Cell } from '@smui/layout-grid';

  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  let characterId = $derived(() => data.characterId);
  let step = $derived(() => data.step);
</script>

<LayoutGrid>
  <Cell span={12}>
    <p>Character ID: {characterId()}</p>
    <p>Step: {step()}</p>
  </Cell>
</LayoutGrid>
