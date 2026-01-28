<script setup>
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center gap-3" to="/">
        <img src="/public/UBO.png" alt="UBO Logo" style="height: 50px; filter: brightness(0) saturate(100%) invert(82%) sepia(65%) saturate(561%) hue-rotate(2deg) brightness(104%) contrast(104%);">
        <span>Gestion Universitaire</span>
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" :class="{ active: route.path === '/' }">
              <i class="bi bi-speedometer2 me-1"></i> Tableau de bord
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/enseignants" :class="{ active: route.path.includes('/enseignants') }">
              <i class="bi bi-person-badge me-1"></i> Enseignants
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/formations" :class="{ active: route.path.includes('/formations') }">
              <i class="bi bi-journal-bookmark me-1"></i> Formations
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/promotions" :class="{ active: route.path.includes('/promotions') }">
              <i class="bi bi-people me-1"></i> Promotions
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/etudiants" :class="{ active: route.path.includes('/etudiants') }">
              <i class="bi bi-mortarboard me-1"></i> Étudiants
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container py-5">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </div>
</template>

<style scoped>
.navbar {
  backdrop-filter: blur(10px);
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  margin: 0 0.2rem;
}

.nav-link:hover, .nav-link.active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
