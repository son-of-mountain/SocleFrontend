<script setup>
import { ref, onMounted, computed } from 'vue'

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
    const response = await fetch('/api/promotions')
    const result = await response.json()
    if (result.status === 'success') {
      promotions.value = result.data
    } else {
      errorMessage.value = result.message || 'Failed to fetch promotions'
    }
  } catch (error) {
    errorMessage.value = 'Error fetching promotions: ' + error.message
  }
}

// Fetch all enseignants for dropdown
const fetchEnseignants = async () => {
  try {
    const response = await fetch('/api/enseignants')
    const result = await response.json()
    if (result.status === 'success') {
      enseignants.value = result.data
    } else {
      errorMessage.value = result.message || 'Failed to fetch enseignants'
    }
  } catch (error) {
    errorMessage.value = 'Error fetching enseignants: ' + error.message
  }
}

// Fetch all formations for dropdown
const fetchFormations = async () => {
  try {
    const response = await fetch('/api/formations')
    const result = await response.json()
    if (result.status === 'success') {
      formations.value = result.data
    } else {
      errorMessage.value = result.message || 'Failed to fetch formations'
    }
  } catch (error) {
    errorMessage.value = 'Error fetching formations: ' + error.message
  }
}

// Add new promotion
const addPromotion = async () => {
  try {
    const response = await fetch('/api/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Promotion added successfully'
      resetForm()
      await fetchPromotions()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to add promotion'
    }
  } catch (error) {
    errorMessage.value = 'Error adding promotion: ' + error.message
  }
}

// Update promotion
const updatePromotion = async () => {
  try {
    const response = await fetch(`/api/promotions/${form.value.anneePro}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Promotion updated successfully'
      resetForm()
      await fetchPromotions()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to update promotion'
    }
  } catch (error) {
    errorMessage.value = 'Error updating promotion: ' + error.message
  }
}

// Delete promotion
const deletePromotion = async (anneePro) => {
  if (!confirm('Are you sure you want to delete this promotion?')) return
  
  try {
    const response = await fetch(`/api/promotions/${anneePro}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Promotion deleted successfully'
      await fetchPromotions()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to delete promotion'
    }
  } catch (error) {
    errorMessage.value = 'Error deleting promotion: ' + error.message
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
})
</script>

<template>
  <div>
    <h2 class="mb-4">Manage Promotions</h2>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''"></button>
    </div>

    <!-- Form -->
    <div class="card mb-4">
      <div class="card-header">
        <h5>{{ isEditing ? 'Edit Promotion' : 'Add New Promotion' }}</h5>
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
                <option value="">-- Select Formation --</option>
                <option v-for="formation in formations" :key="formation.codeFormation" :value="formation.codeFormation">
                  {{ formation.nomFormation }} ({{ formation.codeFormation }})
                </option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Responsable (Enseignant) *</label>
              <select v-model="form.noEnseignant" class="form-select" required>
                <option :value="null">-- Select Enseignant --</option>
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
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
            <button v-if="isEditing" type="button" class="btn btn-secondary" @click="resetForm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="card-header">
        <h5>Promotions List</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>Année Pro</th>
                <th>Sigle</th>
                <th>Formation</th>
                <th>Responsable</th>
                <th>Nb Étu Souhaité</th>
                <th>Date Rentrée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="promotions.length === 0">
                <td colspan="7" class="text-center">No promotions found</td>
              </tr>
              <tr v-for="promotion in promotions" :key="promotion.anneePro">
                <td>{{ promotion.anneePro }}</td>
                <td>{{ promotion.siglePro }}</td>
                <td>{{ getFormationName(promotion.codeFormation) }}</td>
                <td>{{ getEnseignantName(promotion.noEnseignant) }}</td>
                <td>{{ promotion.nbEtuSouhaite }}</td>
                <td>{{ promotion.dateRentree }}</td>
                <td>
                  <button @click="editPromotion(promotion)" class="btn btn-sm btn-warning me-2">
                    Edit
                  </button>
                  <button @click="deletePromotion(promotion.anneePro)" class="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
