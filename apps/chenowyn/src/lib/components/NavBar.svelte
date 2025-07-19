<!--
- Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script lang="ts">
  import UserButton from '$lib/components/UserButton.svelte';
</script>

<style lang="scss">
  @use '$lib/styles/tokens';

  .brand-text {
    background: linear-gradient(90deg, white, tokens.$brand-accent);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: tokens.$brand-accent;
    font-size: tokens.$font-size-3x;
    text-transform: uppercase;
  }

  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: tokens.$navbar-height;
    background-color: tokens.$brand-surface;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    z-index: 10;
  }

  .user-button-container {
    margin-left: auto;
  }
</style>

<div class="nav-bar">
  <div class="brand-text">Automata Character Builder</div>
  <div class="user-button-container">
    <UserButton />
  </div>
</div>
