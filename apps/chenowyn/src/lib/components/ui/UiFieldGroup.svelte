<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  interface Props {
    title?: string;
    description?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { children, title, description }: Props & { children?: any; } = $props();
</script>

<style lang="scss">
  @use '$lib/styles/tokens';

  .ui-field-group {
    margin-bottom: tokens.$space-medium;

    .group-title {
      font-size: tokens.$font-size-lg;
      font-weight: 600;
      margin-bottom: tokens.$space-xsmall;
    }

    .group-description {
      font-size: tokens.$font-size-sm;
      color: tokens.$color-muted;
      margin-bottom: tokens.$space-small;
    }

    .field-list {
      display: flex;
      flex-direction: column;
      gap: tokens.$space-small;
    }
  }
</style>

<div class="ui-field-group">
  {#if title}<h2 class="group-title">{title}</h2>{/if}
  {#if description}<p class="group-description">{description}</p>{/if}
  <div class="field-list">
    {@render children()}
  </div>
</div>

