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

<NavBar />

<UiContainer>
  <main style="margin-top: 64px">
    {@render children()}
  </main>
</UiContainer>
