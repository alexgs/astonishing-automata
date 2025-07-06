<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import TextField from '@smui/textfield';
  import Button from '@smui/button';
  import { auth } from '$lib/clerk';

  import type { PageProps } from './$types';

  const { session } = auth;

  let name = $state('');
  let isSaving = $state(false);
  let error = $state<string | null>(null);

  let { data }: PageProps = $props();
  let characterId = $derived(() => data.characterId);
  let step = $derived(() => data.step);

  async function submitName() {
    isSaving = true;
    error = null;
    const token = await $session?.getToken();
    try {
      const response = await fetch('http://localhost:3000/api/v1/character-builder/patch-character', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: characterId(),
          data: {
            name,
          },
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.message || 'Error saving character name');
      }

      // Optional: maybe transition to next screen here
    } catch (err) {
      if (err instanceof Error) {
        error = err.message || 'Unexpected error';
      } else {
        error = 'An unknown error occurred';
      }
    } finally {
      isSaving = false;
    }
  }
</script>

<LayoutGrid>
  <Cell span={12}>
    <p>Character ID: {characterId()}</p>
  </Cell>
  <Cell span={12}>
    <TextField bind:value={name} label="Character Name" />
  </Cell>
  <Cell span={12}>
    <Button disabled={isSaving} onclick={submitName}>
      { isSaving ? 'Saving…' : 'Save Name' }
    </Button>
  </Cell>
  {#if error}
    <Cell span={12}>
      <p style="color: red;">{error}</p>
    </Cell>
  {/if}
</LayoutGrid>
