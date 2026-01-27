<script setup>
import { ref, onMounted } from 'vue'

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

// Fetch all formations
const fetchFormations = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/formations')
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
      successMessage.value = 'Formation added successfully'
      resetForm()
      await fetchFormations()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to add formation'
    }
  } catch (error) {
    errorMessage.value = 'Error adding formation: ' + error.message
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
      successMessage.value = 'Formation updated successfully'
      resetForm()
      await fetchFormations()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to update formation'
    }
  } catch (error) {
    errorMessage.value = 'Error updating formation: ' + error.message
  }
}

// Delete formation
const deleteFormation = async (codeFormation) => {
  if (!confirm('Are you sure you want to delete this formation?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/formations/${codeFormation}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Formation deleted successfully'
      await fetchFormations()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to delete formation'
    }
  } catch (error) {
    errorMessage.value = 'Error deleting formation: ' + error.message
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
})
</script>

<template>
  <div>
    <h2 class="mb-4">Gestion des Formations</h2>

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
                <th>Code</th>
                <th>Nom Formation</th>
                <th>Diplôme</th>
                <th>N° Année</th>
                <th>Double Diplôme</th>
                <th>Début Habilitation</th>
                <th>Fin Habilitation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="formations.length === 0">
                <td colspan="8" class="text-center">Aucune formation trouvée</td>
              </tr>
              <tr v-for="formation in formations" :key="formation.codeFormation">
                <td>{{ formation.codeFormation }}</td>
                <td>{{ formation.nomFormation }}</td>
                <td>{{ formation.diplome }}</td>
                <td>{{ formation.n0Annee }}</td>
                <td>{{ formation.doubleDiplome }}</td>
                <td>{{ formation.debutHabilitation }}</td>
                <td>{{ formation.finHabilitation }}</td>
                <td>
                  <button @click="editFormation(formation)" class="btn btn-sm btn-warning me-2">
                    Modifier
                  </button>
                  <button @click="deleteFormation(formation.codeFormation)" class="btn btn-sm btn-danger">
                    Supprimer
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
