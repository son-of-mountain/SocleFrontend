<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="container mt-5">
    <div class="text-center mb-5 fade-in-up">
      <span class="badge bg-light text-primary mb-3 shadow-sm rounded-pill px-3 py-2">Bienvenue</span>
      <h1 class="display-4 fw-bold mb-3">Portail de Gestion <span class="text-gradient">Universitaire</span></h1>
      <p class="lead text-muted">Gérez vos ressources académiques en toute simplicité</p>
    </div>
    
    <div class="row g-4">
      <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.1s">
        <RouterLink to="/enseignants" class="text-decoration-none">
          <div class="card h-100 hover-card border-0 bg-gradient-primary text-white overflow-hidden relative">
            <div class="card-body p-4 text-center position-relative z-1">
              <div class="icon-circle bg-white text-primary mb-4 mx-auto">
                <i class="bi bi-person-badge fs-2"></i>
              </div>
              <h4 class="card-title fw-bold">Enseignants</h4>
              <p class="card-text opacity-75 small">Gestion du corps professoral</p>
            </div>
            <div class="circle-decoration"></div>
          </div>
        </RouterLink>
      </div>

      <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.2s">
        <RouterLink to="/formations" class="text-decoration-none">
          <div class="card h-100 hover-card border-0 bg-gradient-success text-white overflow-hidden relative">
            <div class="card-body p-4 text-center position-relative z-1">
              <div class="icon-circle bg-white text-success mb-4 mx-auto">
                <i class="bi bi-journal-bookmark fs-2"></i>
              </div>
              <h4 class="card-title fw-bold">Formations</h4>
              <p class="card-text opacity-75 small">Catalogues et diplômes</p>
            </div>
            <div class="circle-decoration"></div>
          </div>
        </RouterLink>
      </div>

      <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.3s">
        <RouterLink to="/promotions" class="text-decoration-none">
          <div class="card h-100 hover-card border-0 bg-gradient-warning text-white overflow-hidden relative">
            <div class="card-body p-4 text-center position-relative z-1">
              <div class="icon-circle bg-white text-warning mb-4 mx-auto">
                <i class="bi bi-people fs-2"></i>
              </div>
              <h4 class="card-title fw-bold">Promotions</h4>
              <p class="card-text opacity-75 small">Suivi des années</p>
            </div>
            <div class="circle-decoration"></div>
          </div>
        </RouterLink>
      </div>

      <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.4s">
        <RouterLink to="/etudiants" class="text-decoration-none">
          <div class="card h-100 hover-card border-0 bg-gradient-danger text-white overflow-hidden relative">
            <div class="card-body p-4 text-center position-relative z-1">
              <div class="icon-circle bg-white text-danger mb-4 mx-auto">
                <i class="bi bi-mortarboard fs-2"></i>
              </div>
              <h4 class="card-title fw-bold">Étudiants</h4>
              <p class="card-text opacity-75 small">Inscriptions et dossiers</p>
            </div>
            <div class="circle-decoration"></div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.hover-card:hover .icon-circle {
  transform: scale(1.1) rotate(5deg);
}

.bg-gradient-primary { background: linear-gradient(45deg, #4e54c8, #8f94fb); }
.bg-gradient-success { background: linear-gradient(45deg, #11998e, #38ef7d); }
.bg-gradient-warning { background: linear-gradient(45deg, #f2994a, #f2c94c); }
.bg-gradient-danger { background: linear-gradient(45deg, #ff416c, #ff4b2b); }

.relative { position: relative; }
.z-1 { z-index: 1; }

.circle-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
