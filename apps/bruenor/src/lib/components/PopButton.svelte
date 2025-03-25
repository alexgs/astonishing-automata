<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import Button from '@smui/button';

  let { children } = $props();
</script>

<Button class="pop-button" variant="outlined">
    {@render children()}
</Button>
