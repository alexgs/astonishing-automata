<script lang="ts">
  import { onMount } from 'svelte';

  import { auth } from '$lib/clerk';
  import NavBar from '$lib/components/NavBar.svelte';
  import UiContainer from '$lib/components/ui/UiContainer.svelte';
  import '$lib/styles/app.scss';

  auth.provideStore(auth.userStore);

  onMount(() => {
    auth.init();
  });

	let { children } = $props();
</script>

<style lang="scss">
  @use '$lib/styles/tokens' as tokens;

  :global(body) {
    background: transparent;
  }

  .gradient {
    background: tokens.$color-bg linear-gradient(to bottom, transparent, tokens.$purple_3);
    height: 50vh;
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
</style>

<div class="gradient"></div>

<NavBar />

<UiContainer>
  <main style="margin-top: 64px">
    {@render children()}
  </main>
</UiContainer>
