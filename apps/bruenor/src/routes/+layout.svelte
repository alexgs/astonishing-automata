<script lang="ts">
  import { onMount } from 'svelte';

  import { auth } from '$lib/clerk';
  import AppContainer from '$lib/components/AppContainer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
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

<NavBar />

<AppContainer>
  <main style="margin-top: 64px">
    {@render children()}
  </main>
</AppContainer>
