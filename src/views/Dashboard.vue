<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="background-image"></div>
    <div class="container mt-5 position-relative">
      <div class="text-center mb-5 fade-in-up">
        <span class="badge bg-ubo mb-3 shadow-sm rounded-pill px-4 py-2">Université de Bretagne Occidentale</span>
        <h1 class="display-4 fw-bold mb-3 text-dark">Portail de Gestion <span class="text-ubo">Universitaire</span></h1>
        <p class="lead text-muted">Gérez vos ressources académiques en toute simplicité</p>
      </div>
      
      <div class="row g-4">
        <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.1s">
          <RouterLink to="/enseignants" class="text-decoration-none">
            <div class="card h-100 hover-card border-0 bg-ubo-gradient text-dark overflow-hidden relative">
              <div class="card-body p-4 text-center position-relative z-1">
                <div class="icon-circle bg-black text-ubo mb-4 mx-auto">
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
            <div class="card h-100 hover-card border-0 bg-dark-gradient text-white overflow-hidden relative">
              <div class="card-body p-4 text-center position-relative z-1">
                <div class="icon-circle bg-ubo text-dark mb-4 mx-auto">
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
            <div class="card h-100 hover-card border-0 bg-ubo-gradient text-dark overflow-hidden relative">
              <div class="card-body p-4 text-center position-relative z-1">
                <div class="icon-circle bg-black text-ubo mb-4 mx-auto">
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
            <div class="card h-100 hover-card border-0 bg-dark-gradient text-white overflow-hidden relative">
              <div class="card-body p-4 text-center position-relative z-1">
                <div class="icon-circle bg-ubo text-dark mb-4 mx-auto">
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
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  position: relative;
  min-height: 80vh;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Pont_de_Recouvrance_Brest_2013.jpg/1920px-Pont_de_Recouvrance_Brest_2013.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(8px) brightness(0.4);
  z-index: -1;
}

.dashboard-wrapper::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 215, 0, 0.1);
  z-index: -1;
}

.text-ubo {
  color: #FFD700;
  font-weight: 800;
}

.bg-ubo {
  background: #FFD700 !important;
  color: #1a1a1a !important;
  font-weight: 600;
}

.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.hover-card:hover .icon-circle {
  transform: scale(1.1) rotate(5deg);
}

.bg-ubo-gradient { 
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.3);
}

.bg-dark-gradient { 
  background: linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.bg-black {
  background: #1a1a1a;
}

.bg-ubo {
  background: #FFD700;
}

.text-ubo {
  color: #FFD700;
}

.text-dark {
  color: #1a1a1a !important;
}

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
