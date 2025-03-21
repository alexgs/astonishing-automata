<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  let { children } = $props();
</script>

<style>
  .container {
    width: calc(100% - 1rem);
    padding: 0.5rem;
  }

  @media screen and (min-width: 640px) {
    .container {
      margin: 0 auto;
      width: calc(640px - 1rem);
    }
  }

  @media screen and (min-width: 768px) {
    .container {
      margin: 0 auto;
      width: calc(768px - 1rem);
    }
  }

  @media screen and (min-width: 1024px) {
    .container {
      margin: 0 auto;
      width: calc(1024px - 1rem);
    }
  }
</style>

<div class="container">
  {@render children()}
</div>
