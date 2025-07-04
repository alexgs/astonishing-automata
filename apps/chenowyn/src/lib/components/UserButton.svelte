<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { auth } from '$lib/clerk';
  const { clerk, user } = auth;

  const handleClick = async () => {
    if ($user) {
      await clerk.signOut();
    } else {
      clerk.openSignIn();
    }
  };
</script>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  img,
  .icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .icon {
    background-color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
</style>

<button on:click={handleClick}>
  {#if $user?.imageUrl}
    <img src={$user.imageUrl} alt="Profile" />
  {:else}
    <div class="icon">👤</div>
  {/if}
</button>
