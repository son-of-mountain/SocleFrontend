<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { validatePromotion } from '../utils/validators'

const promotions = ref([])
const enseignants = ref([])
const formations = ref([])
const form = ref({
  anneePro: '',
  siglePro: '',
  nbEtuSouhaite: null,
  etatPreselection: '',
  dateRentree: '',
  lieuRentree: '',
  codeFormation: '',
  noEnseignant: null
})
const isEditing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedPromotion = ref(null)
let pollingInterval = null

// Sorting
const sortColumn = ref('')
const sortOrder = ref('asc')

const sortedPromotions = computed(() => {
  return [...promotions.value].sort((a, b) => {
    if (!sortColumn.value) return 0
    const valA = a[sortColumn.value]
    const valB = b[sortColumn.value]
    
    if (valA == null) return 1
    if (valB == null) return -1
    
    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

// Computed property to get formation name by code
const getFormationName = (codeFormation) => {
  const formation = formations.value.find(f => f.codeFormation === codeFormation)
  return formation ? formation.nomFormation : codeFormation
}

// Computed property to get enseignant full name by number
const getEnseignantName = (noEnseignant) => {
  const enseignant = enseignants.value.find(e => e.noEnseignant === noEnseignant)
  return enseignant ? `${enseignant.prenom} ${enseignant.nom}` : noEnseignant
}

// Fetch all promotions
const fetchPromotions = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/promotions')
    const result = await response.json()
    promotions.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des promotions: ' + error.message
  }
}

// Fetch all enseignants for dropdown
const fetchEnseignants = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/enseignants')
    const result = await response.json()
    enseignants.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des enseignants: ' + error.message
  }
}

// Fetch all formations for dropdown
const fetchFormations = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/formations')
    const result = await response.json()
    formations.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des formations: ' + error.message
  }
}

// Add new promotion
const addPromotion = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Promotion ajoutée avec succès'
      resetForm()
      await fetchPromotions()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de l\'ajout de la promotion'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'ajout de la promotion : ' + error.message
  }
}

// Update promotion
const updatePromotion = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/promotions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Promotion mise à jour avec succès'
      resetForm()
      await fetchPromotions()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la mise à jour de la promotion'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour de la promotion : ' + error.message
  }
}

// Delete promotion
const deletePromotion = async (anneePro) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/promotions/${anneePro}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Promotion supprimée avec succès'
      await fetchPromotions()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la suppression de la promotion'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de la promotion : ' + error.message
  }
}

// Edit promotion (populate form)
const editPromotion = (promotion) => {
  form.value = { ...promotion }
  isEditing.value = true
  errorMessage.value = ''
}

// Submit form
const submitForm = () => {
  errorMessage.value = ''

  // Validation DB Front-end
  const errors = validatePromotion(form.value)
  if (Object.keys(errors).length > 0) {
    const errorList = Object.entries(errors)
      .map(([field, msg]) => `• ${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
      .join('\n')
    errorMessage.value = "Veuillez corriger les erreurs suivantes :\n" + errorList
    return
  }

  if (isEditing.value) {
    updatePromotion()
  } else {
    addPromotion()
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    anneePro: '',
    siglePro: '',
    nbEtuSouhaite: null,
    etatPreselection: '',
    dateRentree: '',
    lieuRentree: '',
    codeFormation: '',
    noEnseignant: null
  }
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(async () => {
  // Fetch enseignants and formations first for dropdowns
  await Promise.all([fetchEnseignants(), fetchFormations()])
  // Then fetch promotions
  await fetchPromotions()
  
  pollingInterval = setInterval(fetchPromotions, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="position-relative">
    <div class="page-background"></div>
    <h2 class="mb-4 text-black">Gestion des Promotions</h2>

    <!-- Messages de succès/erreur -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''"></button>
    </div>

    <!-- Formulaire -->
    <div class="card mb-4">
      <div class="card-header">
        <h5>{{ isEditing ? 'Modifier la Promotion' : 'Ajouter une Promotion' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Année Pro (ex: 2025-2026) *</label>
              <input v-model="form.anneePro" type="text" class="form-control" :disabled="isEditing" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Sigle Pro *</label>
              <input v-model="form.siglePro" type="text" class="form-control" required>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Formation *</label>
              <select v-model="form.codeFormation" class="form-select" required>
                <option value="">-- Sélectionner une Formation --</option>
                <option v-for="formation in formations" :key="formation.codeFormation" :value="formation.codeFormation">
                  {{ formation.nomFormation }} ({{ formation.codeFormation }})
                </option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Responsable (Enseignant) *</label>
              <select v-model="form.noEnseignant" class="form-select" required>
                <option :value="null">-- Sélectionner un Enseignant --</option>
                <option v-for="enseignant in enseignants" :key="enseignant.noEnseignant" :value="enseignant.noEnseignant">
                  {{ enseignant.prenom }} {{ enseignant.nom }} ({{ enseignant.type }})
                </option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Nb Étudiants Souhaité</label>
              <input v-model.number="form.nbEtuSouhaite" type="number" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Date Rentrée</label>
              <input v-model="form.dateRentree" type="date" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Lieu Rentrée</label>
              <input v-model="form.lieuRentree" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
              <label class="form-label">État Préselection</label>
              <input v-model="form.etatPreselection" type="text" class="form-control">
            </div>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="resetForm">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tableau -->
    <div class="card">
      <div class="card-header">
        <h5>Liste des Promotions</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th @click="sortBy('anneePro')" style="cursor: pointer">
                  Année Pro <i v-if="sortColumn === 'anneePro'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('siglePro')" style="cursor: pointer">
                  Sigle <i v-if="sortColumn === 'siglePro'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('codeFormation')" style="cursor: pointer">
                  Formation <i v-if="sortColumn === 'codeFormation'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('noEnseignant')" style="cursor: pointer">
                  Responsable <i v-if="sortColumn === 'noEnseignant'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('nbEtuSouhaite')" style="cursor: pointer">
                  Nb Étu Souhaité <i v-if="sortColumn === 'nbEtuSouhaite'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('dateRentree')" style="cursor: pointer">
                  Date Rentrée <i v-if="sortColumn === 'dateRentree'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="promotions.length === 0">
                <td colspan="7" class="text-center">Aucune promotion trouvée</td>
              </tr>
              <tr v-for="promotion in sortedPromotions" :key="promotion.anneePro">
                <td>{{ promotion.anneePro }}</td>
                <td>{{ promotion.siglePro }}</td>
                <td>{{ getFormationName(promotion.codeFormation) }}</td>
                <td>{{ getEnseignantName(promotion.noEnseignant) }}</td>
                <td>{{ promotion.nbEtuSouhaite }}</td>
                <td>{{ promotion.dateRentree }}</td>
                <td>
                  <button @click="selectedPromotion = promotion" data-bs-toggle="modal" data-bs-target="#viewPromotionModal" class="btn btn-sm btn-info me-2" title="Voir détails">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button @click="editPromotion(promotion)" class="btn btn-sm btn-warning me-2" title="Modifier">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deletePromotion(promotion.anneePro)" class="btn btn-sm btn-danger" title="Supprimer">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Détails -->
    <div class="modal fade" id="viewPromotionModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de la Promotion</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedPromotion">
            <p><strong>Année Pro:</strong> {{ selectedPromotion.anneePro }}</p>
            <p><strong>Sigle Pro:</strong> {{ selectedPromotion.siglePro }}</p>
            <p><strong>Formation:</strong> {{ getFormationName(selectedPromotion.codeFormation) }}</p>
            <p><strong>Responsable:</strong> {{ getEnseignantName(selectedPromotion.noEnseignant) }}</p>
            <p><strong>Nb Étudiants Souhaité:</strong> {{ selectedPromotion.nbEtuSouhaite }}</p>
            <p><strong>Date Rentrée:</strong> {{ selectedPromotion.dateRentree }}</p>
            <p><strong>Lieu Rentrée:</strong> {{ selectedPromotion.lieuRentree }}</p>
            <p><strong>État Préselection:</strong> {{ selectedPromotion.etatPreselection }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Brest_port_commerce_grues.jpg/1920px-Brest_port_commerce_grues.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(0.5);
  z-index: -1;
}
</style>
