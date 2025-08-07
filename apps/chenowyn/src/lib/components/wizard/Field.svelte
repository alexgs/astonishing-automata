<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { type FieldDefinition, SavageWorlds, evaluateField } from '@automata/grimoire';
  import UiTextInput from '$lib/components/ui/UiTextInput.svelte';
  import { getCharacterState, updateField } from '$lib/stores/character-store';

  interface Props {
    fieldDef: FieldDefinition;
    path: string;
  }

  const { fieldDef, path }: Props = $props();

  let error: string | null = $state(null);
  let value: string = $state(''); // local value tracking (optional, since store is source of truth)

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
    value = raw;

    const coerced = coerceInputValue(raw);
    updateField(path, coerced);

    const result = evaluateField(path, getCharacterState(), SavageWorlds);
    error = result.result ? null : result.violations[0].reason;
  }
</script>

<UiTextInput
  {error}
  label={fieldDef.label ?? fieldDef.key}
  name={path}
  onInput={handleInput}
  {value}
/>
