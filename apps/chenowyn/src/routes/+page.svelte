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
    height: 248px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: tokens.$grey_3;
    color: tokens.$color-text;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>

  <div class="header">
    <h1>Your Characters</h1>
  </div>

  <div class="actions">
    <UiButton onclick={createCharacter} disabled={loading}>
      Create a new character
    </UiButton>
  </div>

  <div class="character-grid">
    <div class="demo-cell">Character 1</div>
    <div class="demo-cell">Character 2</div>
    <div class="demo-cell">Character 3</div>
  </div>
