<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center mb-5">Welcome to University Management System</h1>
    
    <div class="row g-4">
      <div class="col-md-6">
        <RouterLink to="/enseignants" class="text-decoration-none">
          <div class="card text-center h-100 shadow-sm hover-card">
            <div class="card-body d-flex flex-column justify-content-center p-5">
              <i class="bi bi-person-badge fs-1 text-primary mb-3"></i>
              <h3 class="card-title">Manage Enseignants</h3>
              <p class="card-text text-muted">View, add, edit, and delete teachers</p>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="col-md-6">
        <RouterLink to="/formations" class="text-decoration-none">
          <div class="card text-center h-100 shadow-sm hover-card">
            <div class="card-body d-flex flex-column justify-content-center p-5">
              <i class="bi bi-book fs-1 text-success mb-3"></i>
              <h3 class="card-title">Manage Formations</h3>
              <p class="card-text text-muted">View, add, edit, and delete formations</p>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="col-md-6">
        <RouterLink to="/promotions" class="text-decoration-none">
          <div class="card text-center h-100 shadow-sm hover-card">
            <div class="card-body d-flex flex-column justify-content-center p-5">
              <i class="bi bi-people fs-1 text-warning mb-3"></i>
              <h3 class="card-title">Manage Promotions</h3>
              <p class="card-text text-muted">View, add, edit, and delete promotions</p>
            </div>
          </div>
        </RouterLink>
      </div>

      <div class="col-md-6">
        <RouterLink to="/etudiants" class="text-decoration-none">
          <div class="card text-center h-100 shadow-sm hover-card">
            <div class="card-body d-flex flex-column justify-content-center p-5">
              <i class="bi bi-mortarboard fs-1 text-danger mb-3"></i>
              <h3 class="card-title">Manage Étudiants</h3>
              <p class="card-text text-muted">View, add, edit, and delete students</p>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
