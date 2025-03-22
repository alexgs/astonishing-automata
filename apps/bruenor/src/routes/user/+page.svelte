<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { clerk } from '$lib/clerk';
  import type { UserResource } from '@clerk/types';

  let user: UserResource | null = null;

  onMount(async () => {
    if (clerk.user) {
      user = clerk.user;
    // } else {
    //   await clerk.openSignIn();
    }
  });
</script>

{#if user}
  <p>Welcome, {user.firstName}!</p>
{:else}
  <button on:click={() => clerk.openSignIn()}>Sign In</button>
{/if}
