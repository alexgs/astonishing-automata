<script lang="ts">
	import '../app.css';
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
