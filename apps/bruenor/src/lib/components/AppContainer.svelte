<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  let { children } = $props();
</script>

<style>
  .container {
    width: calc(100% - 1rem);
    padding: 0 0.5rem;
  }

  @media screen and (min-width: 610px) {
    .container {
      margin: 0 auto;
      padding: 0;
      width: 600px;
    }
  }

  @media screen and (min-width: 904px) {
    .container {
      margin: 0 auto;
      padding: 0;
      max-width: 840px;
    }
  }

  @media screen and (min-width: 1240px) {
    .container {
      margin: 0 auto;
      padding: 0;
      max-width: 1080px;
    }
  }
</style>

<div class="container">
  {@render children()}
</div>
