<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  let { children } = $props();
</script>

<style>
  .container {
    width: 100%;
    padding: 0.5rem;
  }

  @media screen and (min-width: 640px) {
    .container {
      margin: 0 auto;
      width: 640px;
    }
  }

  @media screen and (min-width: 768px) {
    .container {
      margin: 0 auto;
      width: 768px;
    }
  }

  @media screen and (min-width: 1024px) {
    .container {
      margin: 0 auto;
      width: 1024px;
    }
  }

  @media screen and (min-width: 1280px) {
    .container {
      margin: 0 auto;
      width: 1280px;
    }
  }
</style>

<div class="container">
  {@render children()}
</div>
