<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import Drawer, { Content } from '@smui/drawer';
  import List, { Item } from '@smui/list';
  import Button, { Label } from '@smui/button';

  let open = $state(false);
</script>

<Drawer variant="dismissible" bind:open>
  <Content>
    <List>
      <Item onclick={() => alert('Home clicked')}>Home</Item>
      <Item onclick={() => alert('Settings clicked')}>Settings</Item>
      <Item onclick={() => (open = !open)}>Close</Item>
    </List>
  </Content>
</Drawer>

<TopAppBar>
  <Row>
    <Section align="start">
      <Title>Automata Character Builder</Title>
    </Section>
    <Section align="end">
      <Button variant="raised" onclick={() => alert('Hello!')}>Click Me</Button>
    </Section>
  </Row>
</TopAppBar>

<main style="padding: 1rem;">
  <p style="margin-top: 64px">Automata is a modular and extensible TTRPG character builder.</p>
  <Button onclick={() => (open = !open)} color="secondary" variant="outlined">
    <Label>Toggle Drawer</Label>
  </Button>
  <br />
  <pre class="status">Active: {open}</pre>

</main>
