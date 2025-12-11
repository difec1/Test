<template>
  <div class="app-shell">
    <header class="topbar">
      <h1>SmartBudgetAI</h1>
      <nav>
        <RouterLink to="/goals">Sparziele</RouterLink>
        <RouterLink to="/analysis">Analyse</RouterLink>
        <RouterLink to="/history">Verlauf</RouterLink>
      </nav>
    </header>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-shell {
  background: #f4f6fb;
  min-height: 100vh;
  color: #0f172a;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.topbar nav a {
  margin-left: 1rem;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
}
.content {
  padding: 1.5rem;
}
</style>
