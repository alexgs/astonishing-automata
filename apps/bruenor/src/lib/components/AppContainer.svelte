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

  @media screen and (min-width: 600px) {
    .container {
      margin: 0 auto;
      width: calc(600px - 1rem);
    }
  }

  @media screen and (min-width: 904px) {
    .container {
      margin: 0 auto;
      max-width: calc(840px - 1rem);
    }
  }

  @media screen and (min-width: 1240px) {
    .container {
      margin: 0 auto;
      max-width: calc(1080px - 1rem);
    }
  }
</style>

<div class="container">
  {@render children()}
</div>
