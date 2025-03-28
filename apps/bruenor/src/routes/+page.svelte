<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import { Label } from '@smui/button';
  import LayoutGrid, { Cell } from '@smui/layout-grid';

  import { goto } from '$app/navigation';
  import PopButton from '$lib/components/PopButton.svelte';
  import { auth } from '$lib/clerk';
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
          Authorization: `Bearer ${token}`, // Ensure you have a valid auth token
        },
      });

      if (!res.ok) {
        throw new Error('Failed to start character');
      }

      const { data } = await res.json();
      await goto(`/wizard/${data.characterId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to start a new character.');
    } finally {
      loading = false;
    }
  }
</script>

<style>
  h1 {
    margin: 0;
    text-align: center;
  }

  .button-container {
    text-align: center;
  }

  .demo-cell {
    height: 248px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--mdc-theme-secondary, #333);
    color: var(--mdc-theme-on-secondary, #fff);
  }
</style>

<LayoutGrid>
  <Cell span={12}>
    <h1>Your Characters</h1>
  </Cell>
  <Cell span={12}>
    <div class="button-container">
      <PopButton onclick={createCharacter} disabled={loading}>
        <Label>Create a new character</Label>
      </PopButton>
    </div>
  </Cell>
  <Cell span={4}>
    <div class="demo-cell">Character 1</div>
  </Cell>
  <Cell span={4}>
    <div class="demo-cell">Character 2</div>
  </Cell>
  <Cell span={4}>
    <div class="demo-cell">Character 3</div>
  </Cell>
</LayoutGrid>
