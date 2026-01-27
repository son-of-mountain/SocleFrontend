<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">University Management System</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Dashboard</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/enseignants">Enseignants</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/formations">Formations</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/promotions">Promotions</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/etudiants">Étudiants</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container mt-4">
    <RouterView />
  </div>
</template>

<style scoped>
.router-link-active {
  font-weight: bold;
}
</style>
