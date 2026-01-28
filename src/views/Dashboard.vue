<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const stats = ref({
  enseignants: 0,
  etudiants: 0,
  formations: 0,
  promotions: 0
})

const isLoading = ref(true)
let pollingInterval = null

const fetchStats = async () => {
  try {
    const [enseignantsRes, etudiantsRes, formationsRes, promotionsRes] = await Promise.all([
      fetch('/api/enseignants'),
      fetch('/api/etudiants'),
      fetch('/api/formations'),
      fetch('/api/promotions')
    ])

    const enseignants = await enseignantsRes.json()
    const etudiants = await etudiantsRes.json()
    const formations = await formationsRes.json()
    const promotions = await promotionsRes.json()

    stats.value = {
      enseignants: Array.isArray(enseignants) ? enseignants.length : 0,
      etudiants: Array.isArray(etudiants) ? etudiants.length : 0,
      formations: Array.isArray(formations) ? formations.length : 0,
      promotions: Array.isArray(promotions) ? promotions.length : 0
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStats()
  // Poll every 5 seconds for updates
  pollingInterval = setInterval(fetchStats, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="background-image"></div>
    <div class="container mt-5 position-relative">
      <div class="text-center mb-5 fade-in-up">
        <span class="badge bg-white text-dark mb-3 shadow-sm rounded-pill px-4 py-2 border border-warning"> Université de Bretagne Occidentale</span>
        <h1 class="display-4 fw-bold mb-3 text-dark">Tableau de Bord <span class="text-ubo">Universitaire</span></h1>
        <p class="lead text-dark bg-white bg-opacity-75 d-inline-block px-3 py-1 rounded">Une vue d'ensemble de vos ressources académiques</p>
      </div>
      
      <div class="row g-4">
        
        <!-- Carte Etudiants (Jaune - Thème Principal) -->
        <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.1s">
          <RouterLink to="/etudiants" class="text-decoration-none">
            <div class="stat-card card-yellow h-100 shadow-sm">
              <div class="card-body p-4 position-relative overflow-hidden">
                <div class="d-flex justify-content-between align-items-start position-relative z-1">
                  <div>
                    <h6 class="text-uppercase fw-bold opacity-75 mb-2 text-dark">Étudiants</h6>
                    <div v-if="isLoading" class="spinner-border text-dark" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2 v-else class="display-4 fw-bold mb-0 text-dark">{{ stats.etudiants }}</h2>
                  </div>
                  <div class="icon-box bg-white bg-opacity-25 rounded-circle p-2">
                    <i class="bi bi-mortarboard fs-3 text-dark"></i>
                  </div>
                </div>
                <!-- Decorative big icon -->
                <i class="bi bi-mortarboard position-absolute text-dark opacity-10" style="font-size: 8rem; bottom: -2rem; right: -2rem;"></i>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Carte Formations (Vert - Validation) -->
        <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.2s">
          <RouterLink to="/formations" class="text-decoration-none">
            <div class="stat-card card-green h-100 shadow-sm">
              <div class="card-body p-4 position-relative overflow-hidden">
                <div class="d-flex justify-content-between align-items-start position-relative z-1">
                  <div>
                    <h6 class="text-uppercase fw-bold opacity-75 mb-2 text-white">Formations</h6>
                    <div v-if="isLoading" class="spinner-border text-white" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2 v-else class="display-4 fw-bold mb-0 text-white">{{ stats.formations }}</h2>
                  </div>
                  <div class="icon-box bg-white bg-opacity-25 rounded-circle p-2">
                    <i class="bi bi-journal-check fs-3 text-white"></i>
                  </div>
                </div>
                <i class="bi bi-journal-check position-absolute text-white opacity-10" style="font-size: 8rem; bottom: -2rem; right: -2rem;"></i>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Carte Promotions (Rouge/Rose - Calendrier/Planning) -->
        <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.3s">
          <RouterLink to="/promotions" class="text-decoration-none">
            <div class="stat-card card-red h-100 shadow-sm">
              <div class="card-body p-4 position-relative overflow-hidden">
                <div class="d-flex justify-content-between align-items-start position-relative z-1">
                  <div>
                    <h6 class="text-uppercase fw-bold opacity-75 mb-2 text-white">Promotions</h6>
                    <div v-if="isLoading" class="spinner-border text-white" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2 v-else class="display-4 fw-bold mb-0 text-white">{{ stats.promotions }}</h2>
                  </div>
                  <div class="icon-box bg-white bg-opacity-25 rounded-circle p-2">
                    <i class="bi bi-calendar-range fs-3 text-white"></i>
                  </div>
                </div>
                <i class="bi bi-calendar-range position-absolute text-white opacity-10" style="font-size: 8rem; bottom: -2rem; right: -2rem;"></i>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Carte Enseignants (Bleu - Instit) -->
        <div class="col-md-6 col-lg-3 fade-in-up" style="animation-delay: 0.4s">
          <RouterLink to="/enseignants" class="text-decoration-none">
            <div class="stat-card card-blue h-100 shadow-sm">
              <div class="card-body p-4 position-relative overflow-hidden">
                <div class="d-flex justify-content-between align-items-start position-relative z-1">
                  <div>
                    <h6 class="text-uppercase fw-bold opacity-75 mb-2 text-white">Enseignants</h6>
                    <div v-if="isLoading" class="spinner-border text-white" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <h2 v-else class="display-4 fw-bold mb-0 text-white">{{ stats.enseignants }}</h2>
                  </div>
                  <div class="icon-box bg-white bg-opacity-25 rounded-circle p-2">
                    <i class="bi bi-person-badge fs-3 text-white"></i>
                  </div>
                </div>
                <i class="bi bi-person-badge position-absolute text-white opacity-10" style="font-size: 8rem; bottom: -2rem; right: -2rem;"></i>
              </div>
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
  filter: blur(8px) brightness(0.6); /* Slightly brighter for better contrast with cards */
  z-index: -1;
}

.text-ubo {
  color: #FFD700; /* UBO Yellow */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* Stat Cards Base Logic */
.stat-card {
  border-radius: 16px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.27), box-shadow 0.3s ease;
  border: none;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2) !important;
}

/* Color Themes */
.card-yellow {
  background: linear-gradient(135deg, #FFD700 0%, #ffdb1a 100%);
  color: #1a1a1a;
}

.card-green {
  background: linear-gradient(135deg, #20bf6b 0%, #0fb9b1 100%);
}

.card-red {
  background: linear-gradient(135deg, #eb3b5a 0%, #fa8231 100%);
}

.card-blue {
  background: linear-gradient(135deg, #3867d6 0%, #2d98da 100%);
}

.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
}

.z-1 { z-index: 1; }

.fade-in-up {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
