<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  let { children } = $props();
</script>

<style lang="scss">
  @use '$lib/styles/tokens/container.scss' as container;

  .container {
    @include container.container;
  }
</style>

<div class="container">
  {@render children()}
</div>
