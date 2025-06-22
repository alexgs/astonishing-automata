<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { writable, derived } from 'svelte/store';

  import { savageWorlds } from '$lib/grimoire/savage-worlds';
  import Field from '$lib/components/Field.svelte';

  const definition = savageWorlds;
  const stepIndex = writable(0);

  // Create character state with default values
  const characterState = writable<Record<string, unknown>>({});

  // Get current step and field paths
  const currentStep = derived(stepIndex, ($stepIndex) => definition.steps[$stepIndex]);

  function next() {
    stepIndex.update((n) => (n < definition.steps.length - 1 ? n + 1 : n));
  }

  function prev() {
    stepIndex.update((n) => (n > 0 ? n - 1 : 0));
  }
</script>

<main class="p-4 space-y-4">
  <h1 class="text-2xl font-bold">{definition.name}</h1>

    <h2>Step: {$currentStep.key}</h2>
    <form>
      {#each $currentStep.fields as path (path)}
        <Field {characterState} {path} />
      {/each}
    </form>

  <div class="flex gap-4">
    <button onclick={prev} class="bg-gray-200 rounded px-4 py-2">Previous</button>
    <button onclick={next} class="bg-blue-600 text-white rounded px-4 py-2">Next</button>
  </div>
</main>

