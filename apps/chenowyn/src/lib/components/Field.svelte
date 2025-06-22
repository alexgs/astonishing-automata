<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { type Writable } from 'svelte/store';

  interface Props {
    characterState: Writable<Record<string, unknown>>
    path: string;
  }

  const { characterState, path }: Props = $props();

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    updateField(path, value);
  }

  function updateField(fieldPath: string, value: unknown) {
    characterState.update((currentState) => {
      const newState = { ...currentState };
      const segments = fieldPath.split('.');
      const last = segments.pop();
      if (!last) {
        console.warn(`Invalid field path: ${fieldPath}`);
        return newState; // No valid field to update
      }

      let target = newState;
      for (const segment of segments) {
        if (!(segment in target)) target[segment] = {};
        target = target[segment] as Record<string, unknown>;
      }
      target[last] = value;
      return newState;
    });
  }
</script>

<div>
  <label>{path}</label>
  <input type="text" oninput={handleInput} />
</div>
