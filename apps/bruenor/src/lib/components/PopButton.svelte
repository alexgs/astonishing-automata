<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import Button from '@smui/button';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    disabled?: boolean;
    onclick: () => void;
  }

  let { children, onclick, disabled }: Props = $props();
</script>

<Button class="pop-button" variant="outlined" {onclick} {disabled}>
    {@render children()}
</Button>
