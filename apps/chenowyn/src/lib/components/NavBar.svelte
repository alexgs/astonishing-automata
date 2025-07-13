<!--
- Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import UserButton from '$lib/components/UserButton.svelte';
</script>

<TopAppBar style="background: transparent">
  <Row>
    <Section align="start">
      <Title>Automata Character Builder</Title>
    </Section>
    <Section align="end">
      <UserButton />
    </Section>
  </Row>
</TopAppBar>

