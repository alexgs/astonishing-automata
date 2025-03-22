<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { useClerkStore } from '$lib/clerk/clerk-context';
  import { clerk } from '$lib/clerk/clerk-instance';
  const user = useClerkStore();
</script>

{#if $user}
  <p>Welcome, {$user.firstName}!</p>
{:else}
  <button on:click={() => clerk.openSignIn()}>Sign In</button>
{/if}
