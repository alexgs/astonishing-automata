<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import Button, { Label } from '@smui/button';

  let open = $state(false);
</script>

<p>Automata is a modular and extensible TTRPG character builder.</p>
<Button onclick={() => (open = !open)} color="secondary" variant="outlined">
  <Label>Toggle Drawer</Label>
</Button>
<br />
<pre class="status">Active: {open}</pre>
