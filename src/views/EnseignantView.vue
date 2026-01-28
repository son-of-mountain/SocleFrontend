<script setup>
import { ref, onMounted } from 'vue'

const enseignants = ref([])
const form = ref({
  noEnseignant: null,
  nom: '',
  prenom: '',
  encPersoEmail: '',
  type: 'MCF',
  sexe: 'H',
  adresse: '',
  cp: '',
  ville: '',
  pays: '',
  telPort: ''
})
const isEditing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedEnseignant = ref(null)

// Fetch all enseignants
const fetchEnseignants = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/enseignants')
    const result = await response.json()
    enseignants.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des enseignants: ' + error.message
  }
}

// Add new enseignant
const addEnseignant = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/enseignants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Enseignant ajouté avec succès'
      resetForm()
      await fetchEnseignants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de l\'ajout de l\'enseignant'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'ajout de l\'enseignant : ' + error.message
  }
}

// Update enseignant
const updateEnseignant = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/enseignants', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Enseignant mis à jour avec succès'
      resetForm()
      await fetchEnseignants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la mise à jour de l\'enseignant'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour de l\'enseignant : ' + error.message
  }
}

// Delete enseignant
const deleteEnseignant = async (noEnseignant) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/enseignants/${noEnseignant}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Enseignant supprimé avec succès'
      await fetchEnseignants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la suppression de l\'enseignant'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de l\'enseignant : ' + error.message
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
    encPersoEmail: '',
    type: 'MCF',
    sexe: 'H',
    adresse: '',
    cp: '',
    ville: '',
    pays: '',
    telPort: ''
  }
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(() => {
  fetchEnseignants()
})
</script>

<template>
  <div class="position-relative">
    <div class="page-background"></div>
    <h2 class="mb-4 text-white">Gestion des Enseignants</h2>

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
        <h5>{{ isEditing ? 'Modifier l\'Enseignant' : 'Ajouter un Enseignant' }}</h5>
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
              <label class="form-label">Email Perso *</label>
              <input v-model="form.encPersoEmail" type="email" class="form-control" required>
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
              <label class="form-label">Tél. Portable</label>
              <input v-model="form.telPort" type="text" class="form-control">
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
        <h5>Liste des Enseignants</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Type</th>
                <th>Sexe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="enseignants.length === 0">
                <td colspan="6" class="text-center">Aucun enseignant trouvé</td>
              </tr>
              <tr v-for="enseignant in enseignants" :key="enseignant.noEnseignant">
                <td>{{ enseignant.noEnseignant }}</td>
                <td>{{ enseignant.nom }}</td>
                <td>{{ enseignant.prenom }}</td>
                <td>{{ enseignant.type }}</td>
                <td>{{ enseignant.sexe }}</td>
                <td>
                  <button @click="selectedEnseignant = enseignant" data-bs-toggle="modal" data-bs-target="#viewEnseignantModal" class="btn btn-sm btn-info me-2" title="Voir détails">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button @click="editEnseignant(enseignant)" class="btn btn-sm btn-warning me-2" title="Modifier">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteEnseignant(enseignant.noEnseignant)" class="btn btn-sm btn-danger" title="Supprimer">
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
    <div class="modal fade" id="viewEnseignantModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de l'Enseignant</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedEnseignant">
            <p><strong>N° Enseignant:</strong> {{ selectedEnseignant.noEnseignant }}</p>
            <p><strong>Nom:</strong> {{ selectedEnseignant.nom }}</p>
            <p><strong>Prénom:</strong> {{ selectedEnseignant.prenom }}</p>
            <p><strong>Email Perso:</strong> {{ selectedEnseignant.encPersoEmail }}</p>
            <p><strong>Type:</strong> {{ selectedEnseignant.type }}</p>
            <p><strong>Sexe:</strong> {{ selectedEnseignant.sexe }}</p>
            <p><strong>Tél. Portable:</strong> {{ selectedEnseignant.telPort }}</p>
            <p><strong>Adresse:</strong> {{ selectedEnseignant.adresse }}</p>
            <p><strong>Code Postal:</strong> {{ selectedEnseignant.cp }}</p>
            <p><strong>Ville:</strong> {{ selectedEnseignant.ville }}</p>
            <p><strong>Pays:</strong> {{ selectedEnseignant.pays }}</p>
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
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rade_de_Brest.jpg/1920px-Rade_de_Brest.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(0.5);
  z-index: -1;
}
</style>
