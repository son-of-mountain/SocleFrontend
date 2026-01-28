<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { validateFormation } from '../utils/validators'

const formations = ref([])
const form = ref({
  codeFormation: '',
  nomFormation: '',
  diplome: 'M',
  n0Annee: null,
  doubleDiplome: 'N',
  debutHabilitation: '',
  finHabilitation: ''
})
const isEditing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedFormation = ref(null)
let pollingInterval = null

// Sorting
const sortColumn = ref('')
const sortOrder = ref('asc')

const sortedFormations = computed(() => {
  return [...formations.value].sort((a, b) => {
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

// Fetch all formations
const fetchFormations = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/formations')
    const result = await response.json()
    formations.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des formations: ' + error.message
  }
}

// Add new formation
const addFormation = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/formations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Formation ajoutée avec succès'
      resetForm()
      await fetchFormations()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de l\'ajout de la formation'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'ajout de la formation : ' + error.message
  }
}

// Update formation
const updateFormation = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/formations', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Formation mise à jour avec succès'
      resetForm()
      await fetchFormations()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la mise à jour de la formation'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour de la formation : ' + error.message
  }
}

// Delete formation
const deleteFormation = async (codeFormation) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/formations/${codeFormation}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Formation supprimée avec succès'
      await fetchFormations()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la suppression de la formation'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de la formation : ' + error.message
  }
}

// Edit formation (populate form)
const editFormation = (formation) => {
  form.value = { ...formation }
  isEditing.value = true
  errorMessage.value = ''
}

// Submit form
const submitForm = () => {
  errorMessage.value = ''

  // Validation DB Front-end
  const errors = validateFormation(form.value)
  if (Object.keys(errors).length > 0) {
    const errorList = Object.entries(errors)
      .map(([field, msg]) => `• ${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
      .join('\n')
    errorMessage.value = "Veuillez corriger les erreurs suivantes :\n" + errorList
    return
  }

  if (isEditing.value) {
    updateFormation()
  } else {
    addFormation()
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    codeFormation: '',
    nomFormation: '',
    diplome: 'M',
    n0Annee: null,
    doubleDiplome: 'N',
    debutHabilitation: '',
    finHabilitation: ''
  }
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(() => {
  fetchFormations()
  pollingInterval = setInterval(fetchFormations, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="position-relative">
    <div class="page-background"></div>
    <h2 class="mb-4 text-black">Gestion des Formations</h2>

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
        <h5>{{ isEditing ? 'Modifier la Formation' : 'Ajouter une Formation' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Code Formation *</label>
              <input v-model="form.codeFormation" type="text" class="form-control" :disabled="isEditing" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Nom Formation *</label>
              <input v-model="form.nomFormation" type="text" class="form-control" required>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Diplôme *</label>
              <select v-model="form.diplome" class="form-select" required>
                <option value="M">Master</option>
                <option value="L">Licence</option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">N0 Année</label>
              <input v-model.number="form.n0Annee" type="number" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Double Diplôme *</label>
              <select v-model="form.doubleDiplome" class="form-select" required>
                <option value="O">Oui</option>
                <option value="N">Non</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Début Habilitation</label>
              <input v-model="form.debutHabilitation" type="date" class="form-control">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Fin Habilitation</label>
              <input v-model="form.finHabilitation" type="date" class="form-control">
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
        <h5>Liste des Formations</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th @click="sortBy('codeFormation')" style="cursor: pointer">
                  Code <i v-if="sortColumn === 'codeFormation'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('nomFormation')" style="cursor: pointer">
                  Nom Formation <i v-if="sortColumn === 'nomFormation'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('diplome')" style="cursor: pointer">
                  Diplôme <i v-if="sortColumn === 'diplome'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('n0Annee')" style="cursor: pointer">
                  N° Année <i v-if="sortColumn === 'n0Annee'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('doubleDiplome')" style="cursor: pointer">
                  Double Diplôme <i v-if="sortColumn === 'doubleDiplome'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('debutHabilitation')" style="cursor: pointer">
                  Début Habilitation <i v-if="sortColumn === 'debutHabilitation'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('finHabilitation')" style="cursor: pointer">
                  Fin Habilitation <i v-if="sortColumn === 'finHabilitation'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="formations.length === 0">
                <td colspan="8" class="text-center">Aucune formation trouvée</td>
              </tr>
              <tr v-for="formation in sortedFormations" :key="formation.codeFormation">
                <td>{{ formation.codeFormation }}</td>
                <td>{{ formation.nomFormation }}</td>
                <td>{{ formation.diplome }}</td>
                <td>{{ formation.n0Annee }}</td>
                <td>{{ formation.doubleDiplome }}</td>
                <td>{{ formation.debutHabilitation }}</td>
                <td>{{ formation.finHabilitation }}</td>
                <td>
                  <button @click="selectedFormation = formation" data-bs-toggle="modal" data-bs-target="#viewFormationModal" class="btn btn-sm btn-info me-2" title="Voir détails">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button @click="editFormation(formation)" class="btn btn-sm btn-warning me-2" title="Modifier">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteFormation(formation.codeFormation)" class="btn btn-sm btn-danger" title="Supprimer">
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
    <div class="modal fade" id="viewFormationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de la Formation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedFormation">
            <p><strong>Code Formation:</strong> {{ selectedFormation.codeFormation }}</p>
            <p><strong>Nom Formation:</strong> {{ selectedFormation.nomFormation }}</p>
            <p><strong>Diplôme:</strong> {{ selectedFormation.diplome === 'M' ? 'Master' : 'Licence' }}</p>
            <p><strong>N° Année:</strong> {{ selectedFormation.n0Annee }}</p>
            <p><strong>Double Diplôme:</strong> {{ selectedFormation.doubleDiplome === 'O' ? 'Oui' : 'Non' }}</p>
            <p><strong>Début Habilitation:</strong> {{ selectedFormation.debutHabilitation }}</p>
            <p><strong>Fin Habilitation:</strong> {{ selectedFormation.finHabilitation }}</p>
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
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/T%C3%A9l%C3%A9ph%C3%A9rique_de_Brest.jpg/1920px-T%C3%A9l%C3%A9ph%C3%A9rique_de_Brest.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(0.5);
  z-index: -1;
}
</style>
