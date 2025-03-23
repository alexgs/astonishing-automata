<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { auth } from '$lib/clerk';
  const { session, user } = auth;

  async function retrieveUserProfile() {
    await fetch('http://localhost:3000/api/v1/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await $session?.getToken()}`,
        'Content-Type': 'application/json',
      },
    });
  }

</script>

{#if $user}
  <p>Welcome, {$user.firstName}!</p>
  <button on:click={() => auth.signOut()}>Sign Out</button>
  <div style="margin-top: 2rem">
    <button on:click={retrieveUserProfile}>Fetch user profile</button>
  </div>
{:else}
  <button on:click={() => auth.signIn()}>Sign In</button>
{/if}

