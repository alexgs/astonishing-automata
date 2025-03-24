<script lang="ts">
  import Button from '@smui/button';
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import { onMount } from 'svelte';

  import { auth } from '$lib/clerk';
  import AppContainer from '$lib/components/AppContainer.svelte';
  import '../app.css';

  auth.provideStore(auth.userStore);

  onMount(() => {
    auth.init();
  });

	let { children } = $props();
</script>

<style>
  :global(body) {
    background: transparent;
  }

  /*noinspection CssReplaceWithShorthandSafely*/
  .gradient {
    background: linear-gradient(to bottom, transparent, var(--purple-3));
    background-color: #212121;
    height: 50vh;
    width: 100vw;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
</style>

<div class="gradient"></div>

<TopAppBar style="background: transparent">
  <Row>
    <Section align="start">
      <Title>Automata Character Builder</Title>
    </Section>
    <Section align="end">
      <Button variant="raised" onclick={() => alert('Hello!')}>Click Me</Button>
    </Section>
  </Row>
</TopAppBar>

<AppContainer>
  <main style="margin-top: 64px">
    {@render children()}
  </main>
</AppContainer>
