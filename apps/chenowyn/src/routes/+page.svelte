<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import { goto } from '$app/navigation';
  import { auth } from '$lib/clerk';
  import UiButton from '$lib/components/ui/UiButton.svelte';
  import { config } from '$lib/config';

  const { session } = auth;

  let loading = $state(false);

  async function createCharacter() {
    const token = await $session?.getToken();
    loading = true;
    try {
      const res = await fetch(`https://${config.apiHost}/api/v1/character-builder/start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to start character');
      }

      const { data } = await res.json();
      await goto(`/c/${data.characterId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to start a new character.');
    } finally {
      loading = false;
    }
  }
</script>

<style lang="scss">
  @use '$lib/styles/tokens';
  @use '$lib/styles/tokens/breakpoints.scss' as *;

  .header,
  .actions {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .button-text {
    text-transform: uppercase;
  }

  .character-grid {
    display: grid;
    gap: 1rem;

    // Mobile: single column
    grid-template-columns: 1fr;

    // Tablet+: three columns
    @include respond(tablet) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .demo-cell {
    position: relative;
    padding: 2px; // controls border thickness
    border-radius: 12px;
    background: linear-gradient(15deg, tokens.$color-primary 0%, tokens.$color-surface 80%);
    z-index: 0;

    .inner {
      background-color: tokens.$color-surface;
      border-radius: 10px; // slightly smaller
      padding: 1.5rem;
      text-align: center;
      color: tokens.$color-muted;
      font-weight: 500;

      .content {
        height: 248px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>

  <div class="header">
    <h1 style="color: var(--brand-muted)">Your Characters</h1>
  </div>

  <div class="actions">
    <UiButton onclick={createCharacter} disabled={loading} variant="pop">
      {#if loading}
        <span class="button-text">Loading...</span>
      {:else}
        <span class="button-text">Create a new character</span>
      {/if}
    </UiButton>
  </div>

  <div class="character-grid">
    <div class="demo-cell">
      <div class="inner">
        <div class="content">Character 1</div>
      </div>
    </div>
    <div class="demo-cell">
      <div class="inner">
        <div class="content">Character 2</div>
      </div>
    </div>
    <div class="demo-cell">
      <div class="inner">
        <div class="content">Character 3</div>
      </div>
    </div>
  </div>
