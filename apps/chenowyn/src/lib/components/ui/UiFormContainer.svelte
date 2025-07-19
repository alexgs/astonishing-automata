<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  interface Props {
    maxWidth?: string;
    padding?: string;
  }

  let {
    maxWidth = '40rem',   // 640px
    padding = 'var(--space-medium)',
    children
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: Props & { children?: any} = $props();
</script>

<style lang="scss">
  .ui-form-container {
    width: 100%;
    max-width: var(--max-width);
    padding: 0 var(--padding);
    margin-left: auto;
    margin-right: auto;
  }
</style>

<div class="ui-form-container" style={`--max-width: ${maxWidth}; --padding: ${padding};`}>
  {@render children()}
</div>

