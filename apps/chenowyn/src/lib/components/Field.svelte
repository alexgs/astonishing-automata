<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { type Writable } from 'svelte/store';

  import { evaluateField } from '$lib/grimoire/constraint-service';
  import { savageWorlds } from '$lib/grimoire/savage-worlds';
  import type { FieldDefinition } from '$lib/grimoire/types';

  interface Props {
    characterState: Writable<Record<string, unknown>>;
    fieldDef: FieldDefinition;
    path: string;
  }

  const { characterState, fieldDef, path }: Props = $props();

  let error: string | null = $state(null);

  function coerceInputValue(raw: string): unknown {
    if (fieldDef.type === 'number') {
      const num = Number(raw);
      return isNaN(num) ? null : num;
    }
    // Add more coercions as needed
    return raw;
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    const value = coerceInputValue(raw);
    const nextState = updateField(path, value);

    // Use output from `updateField` to avoid potentially evaluating constraints
    //   on stale data immediately after input.
    const violations = evaluateField(path, nextState, savageWorlds);
    error = violations.length > 0 ? violations[0].reason : null;
  }

  function updateField(fieldPath: string, value: unknown): Record<string, unknown> {
    let newState: Record<string, unknown> = {};

    characterState.update((currentState) => {
      newState = { ...currentState };
      const segments = fieldPath.split('.');
      const last = segments.pop();
      if (!last) {
        console.warn(`Invalid field path: ${fieldPath}`);
        return newState; // No valid field to update
      }

      let target = newState;
      for (const segment of segments) {
        if (!(segment in target)) {
          target[segment] = {};
        }
        target = target[segment] as Record<string, unknown>;
      }
      target[last] = value;
      return newState;
    });

    return newState;
  }
</script>

<div>
  <label>{path}</label>
  <input type="text" oninput={handleInput} />
  {#if error}
    <p class="text-red-600 text-sm mt-1">{error}</p>
  {/if}
</div>
