<!--
  - Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
  -->

<script>
  import ContentContainer from '$lib/components/ContentContainer.svelte';
  import Header from '$lib/components/Header.svelte';

  let currentYear = new Date().getFullYear();
</script>

<ContentContainer>
  <Header />
  <div class="content-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2>Menu</h2>
      <ul>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">Profile</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <h2>Welcome to Automata Character Builder</h2>
      <p>This is a dark-themed web app using the Finn palette.</p>
    </main>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <p>&copy; {currentYear} Automata Character Builder. All rights reserved.</p>
  </footer>
</ContentContainer>
