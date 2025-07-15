<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import { type FieldDefinition, SavageWorlds, evaluateField } from '@automata/grimoire';
  import TextField from '@smui/textfield';
  import { getCharacterState, updateField } from '$lib/stores/character-store';
  import HelperText from '@smui/textfield/helper-text';

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

<div style="margin-bottom: 1rem;">
  <TextField
    label={path}
    id={path}
    type="text"
    value={value}
    oninput={handleInput}
    variant="outlined"
    invalid={!!error}
  >
  </TextField>
  <HelperText persistent>{error}</HelperText>
</div>
