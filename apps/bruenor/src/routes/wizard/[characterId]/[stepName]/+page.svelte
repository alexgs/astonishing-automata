<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { page } from '$app/state';

  const { characterId, stepName } = page.params;

</script>

<LayoutGrid>
  <Cell span={12}>
    <p>Character ID: {characterId}</p>
    <p>Step name: {stepName}</p>
  </Cell>
</LayoutGrid>
