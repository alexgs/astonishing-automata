<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { auth } from '$lib/clerk';
  const user = auth.user;
</script>

{#if $user}
  <p>Welcome, {$user.firstName}!</p>
  <button on:click={() => auth.signOut()}>Sign Out</button>
{:else}
  <button on:click={() => auth.signIn()}>Sign In</button>
{/if}
