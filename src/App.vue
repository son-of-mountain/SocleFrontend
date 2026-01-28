<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const bgImage = computed(() => {
  const path = route.path
  if (path.includes('enseignants')) return '/brest-2.jpg'
  if (path.includes('formations')) return '/brest-3.jpg'
  if (path.includes('promotions')) return '/brest-4.jpg'
  if (path.includes('etudiants')) return '/brest-1.jpg' // Reusing one since we have 4 images for 5 views
  return '/brest-1.jpg'
})
</script>

<template>
  <div class="global-background" :style="{ backgroundImage: `url(${bgImage})` }"></div>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center gap-3" to="/">
        <img src="/UBO.png" alt="UBO Logo" style="height: 50px; width: auto;">
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
.global-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
  filter: blur(8px);
  transform: scale(1.05); /* Prevents white edges from blur */
}

.global-background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
}

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
