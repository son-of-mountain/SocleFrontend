<script setup>
import { ref, onMounted } from 'vue'

const enseignants = ref([])
const form = ref({
  noEnseignant: null,
  nom: '',
  prenom: '',
  emailUbo: '',
  type: 'MCF',
  sexe: 'H',
  adresse: '',
  cp: '',
  ville: '',
  pays: '',
  telephone: ''
})
const isEditing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Fetch all enseignants
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

// Add new enseignant
const addEnseignant = async () => {
  try {
    const response = await fetch('/api/enseignants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Enseignant added successfully'
      resetForm()
      await fetchEnseignants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to add enseignant'
    }
  } catch (error) {
    errorMessage.value = 'Error adding enseignant: ' + error.message
  }
}

// Update enseignant
const updateEnseignant = async () => {
  try {
    const response = await fetch(`/api/enseignants/${form.value.noEnseignant}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Enseignant updated successfully'
      resetForm()
      await fetchEnseignants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to update enseignant'
    }
  } catch (error) {
    errorMessage.value = 'Error updating enseignant: ' + error.message
  }
}

// Delete enseignant
const deleteEnseignant = async (noEnseignant) => {
  if (!confirm('Are you sure you want to delete this enseignant?')) return
  
  try {
    const response = await fetch(`/api/enseignants/${noEnseignant}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Enseignant deleted successfully'
      await fetchEnseignants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to delete enseignant'
    }
  } catch (error) {
    errorMessage.value = 'Error deleting enseignant: ' + error.message
  }
}

// Edit enseignant (populate form)
const editEnseignant = (enseignant) => {
  form.value = { ...enseignant }
  isEditing.value = true
  errorMessage.value = ''
}

// Submit form
const submitForm = () => {
  errorMessage.value = ''
  if (isEditing.value) {
    updateEnseignant()
  } else {
    addEnseignant()
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    noEnseignant: null,
    nom: '',
    prenom: '',
    emailUbo: '',
    type: 'MCF',
    sexe: 'H',
    adresse: '',
    cp: '',
    ville: '',
    pays: '',
    telephone: ''
  }
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(() => {
  fetchEnseignants()
})
</script>

<template>
  <div>
    <h2 class="mb-4">Manage Enseignants</h2>

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
        <h5>{{ isEditing ? 'Edit Enseignant' : 'Add New Enseignant' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Nom *</label>
              <input v-model="form.nom" type="text" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Prénom *</label>
              <input v-model="form.prenom" type="text" class="form-control" required>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Email UBO *</label>
              <input v-model="form.emailUbo" type="email" class="form-control" required>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Type *</label>
              <select v-model="form.type" class="form-select" required>
                <option value="MCF">MCF</option>
                <option value="PRAG">PRAG</option>
                <option value="PROF">PROF</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Sexe *</label>
              <select v-model="form.sexe" class="form-select" required>
                <option value="H">H</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
              <label class="form-label">Adresse</label>
              <input v-model="form.adresse" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Code Postal</label>
              <input v-model="form.cp" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Ville</label>
              <input v-model="form.ville" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Pays</label>
              <input v-model="form.pays" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Téléphone</label>
              <input v-model="form.telephone" type="text" class="form-control">
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
        <h5>Enseignants List</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email UBO</th>
                <th>Type</th>
                <th>Sexe</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="enseignants.length === 0">
                <td colspan="8" class="text-center">No enseignants found</td>
              </tr>
              <tr v-for="enseignant in enseignants" :key="enseignant.noEnseignant">
                <td>{{ enseignant.noEnseignant }}</td>
                <td>{{ enseignant.nom }}</td>
                <td>{{ enseignant.prenom }}</td>
                <td>{{ enseignant.emailUbo }}</td>
                <td>{{ enseignant.type }}</td>
                <td>{{ enseignant.sexe }}</td>
                <td>{{ enseignant.telephone }}</td>
                <td>
                  <button @click="editEnseignant(enseignant)" class="btn btn-sm btn-warning me-2">
                    Edit
                  </button>
                  <button @click="deleteEnseignant(enseignant.noEnseignant)" class="btn btn-sm btn-danger">
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
