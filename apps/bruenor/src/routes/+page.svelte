<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import { Label } from '@smui/button';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import PopButton from '$lib/components/PopButton.svelte';
</script>

<style>
  h1 {
    margin: 0;
    text-align: center;
  }

  .button-container {
    text-align: center;
  }

  .demo-cell {
    height: 248px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--mdc-theme-secondary, #333);
    color: var(--mdc-theme-on-secondary, #fff);
  }
</style>

<LayoutGrid>
  <Cell span={12}>
    <h1>Your Characters</h1>
  </Cell>
  <Cell span={12}>
    <div class="button-container">
      <PopButton>
        <Label>Create a new character</Label>
      </PopButton>
    </div>
  </Cell>
  <Cell span={4}>
    <div class="demo-cell">Character 1</div>
  </Cell>
  <Cell span={4}>
    <div class="demo-cell">Character 2</div>
  </Cell>
  <Cell span={4}>
    <div class="demo-cell">Character 3</div>
  </Cell>
</LayoutGrid>
