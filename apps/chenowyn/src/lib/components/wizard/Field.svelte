<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { type FieldDefinition, SavageWorlds, evaluateField } from '@automata/grimoire';
  import { getCharacterState, updateField } from '$lib/stores/character-store';

  interface Props {
    fieldDef: FieldDefinition;
    path: string;
  }

  const { fieldDef, path }: Props = $props();

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
    updateField(path, value);

    const result = evaluateField(path, getCharacterState(), SavageWorlds);
    error = result.result ? null : result.violations[0].reason;
  }
</script>

<div>
  <label>{path}
    <input type="text" oninput={handleInput} />
  </label>
  {#if error}
    <p class="text-red-600 text-sm mt-1">{error}</p>
  {/if}
</div>
