<script lang="ts">
  import { onMount } from 'svelte';

  import { clerk } from '$lib/clerk/clerk-instance';
  import { userStore } from '$lib/clerk/clerk-store';
  import { provideClerkStore } from '$lib/clerk/clerk-context';

  import '../app.css';

  provideClerkStore(userStore);

  onMount(async () => {
    // Immediately update if already signed in
    if (clerk.user) {
      userStore.set(clerk.user);
    }

    // Listen to changes
    clerk.addListener((resources) => {
      userStore.set(resources.user ?? null);
    });
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
{@render children()}
