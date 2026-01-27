<script setup>
import { ref, onMounted, computed } from 'vue'

const etudiants = ref([])
const promotions = ref([])
const form = ref({
  noEtudiantNat: '',
  nom: '',
  prenom: '',
  sexe: 'H',
  dateNaissance: '',
  lieuNaissance: '',
  situation: '',
  nationalite: '',
  email: '',
  permAdresse: '',
  permCp: '',
  permVille: '',
  permPays: '',
  dernierDiplome: '',
  universite: '',
  sigleEtu: '',
  compteCri: '',
  estDiplome: 'N',
  anneePro: ''
})
const isEditing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed property to get promotion display name
const getPromotionName = (anneePro) => {
  const promotion = promotions.value.find(p => p.anneePro === anneePro)
  return promotion ? `${promotion.anneePro} - ${promotion.siglePro}` : anneePro
}

// Fetch all etudiants
const fetchEtudiants = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/etudiants')
    const result = await response.json()
    if (result.status === 'success') {
      etudiants.value = result.data
    } else {
      errorMessage.value = result.message || 'Failed to fetch etudiants'
    }
  } catch (error) {
    errorMessage.value = 'Error fetching etudiants: ' + error.message
  }
}

// Fetch all promotions for dropdown
const fetchPromotions = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/promotions')
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

// Add new etudiant
const addEtudiant = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/etudiants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Étudiant added successfully'
      resetForm()
      await fetchEtudiants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to add étudiant'
    }
  } catch (error) {
    errorMessage.value = 'Error adding étudiant: ' + error.message
  }
}

// Update etudiant
const updateEtudiant = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/etudiants', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Étudiant updated successfully'
      resetForm()
      await fetchEtudiants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to update étudiant'
    }
  } catch (error) {
    errorMessage.value = 'Error updating étudiant: ' + error.message
  }
}

// Delete etudiant
const deleteEtudiant = async (noEtudiantNat) => {
  if (!confirm('Are you sure you want to delete this étudiant?')) return
  
  try {
    const response = await fetch(`http://localhost:8080/api/etudiants/${noEtudiantNat}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Étudiant deleted successfully'
      await fetchEtudiants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Failed to delete étudiant'
    }
  } catch (error) {
    errorMessage.value = 'Error deleting étudiant: ' + error.message
  }
}

// Edit etudiant (populate form)
const editEtudiant = (etudiant) => {
  form.value = { ...etudiant }
  isEditing.value = true
  errorMessage.value = ''
}

// Submit form
const submitForm = () => {
  errorMessage.value = ''
  if (isEditing.value) {
    updateEtudiant()
  } else {
    addEtudiant()
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    noEtudiantNat: '',
    nom: '',
    prenom: '',
    sexe: 'H',
    dateNaissance: '',
    lieuNaissance: '',
    situation: '',
    nationalite: '',
    email: '',
    permAdresse: '',
    permCp: '',
    permVille: '',
    permPays: '',
    dernierDiplome: '',
    universite: '',
    sigleEtu: '',
    compteCri: '',
    estDiplome: 'N',
    anneePro: ''
  }
  isEditing.value = false
  errorMessage.value = ''
}

onMounted(async () => {
  // Fetch promotions first for dropdown
  await fetchPromotions()
  // Then fetch etudiants
  await fetchEtudiants()
})
</script>

<template>
  <div>
    <h2 class="mb-4">Gestion des Étudiants</h2>

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
        <h5>{{ isEditing ? 'Modifier l\'Étudiant' : 'Ajouter un Étudiant' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">No Étudiant National *</label>
              <input v-model="form.noEtudiantNat" type="text" class="form-control" :disabled="isEditing" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Nom *</label>
              <input v-model="form.nom" type="text" class="form-control" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Prénom *</label>
              <input v-model="form.prenom" type="text" class="form-control" required>
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Sexe *</label>
              <select v-model="form.sexe" class="form-select" required>
                <option value="H">H</option>
                <option value="F">F</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Date Naissance</label>
              <input v-model="form.dateNaissance" type="date" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Lieu Naissance</label>
              <input v-model="form.lieuNaissance" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Nationalité</label>
              <input v-model="form.nationalite" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Email *</label>
              <input v-model="form.email" type="email" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Situation</label>
              <input v-model="form.situation" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
              <label class="form-label">Adresse Permanente</label>
              <input v-model="form.permAdresse" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">Code Postal</label>
              <input v-model="form.permCp" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Ville</label>
              <input v-model="form.permVille" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Pays</label>
              <input v-model="form.permPays" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">Promotion *</label>
              <select v-model="form.anneePro" class="form-select" required>
                <option value="">-- Sélectionner une Promotion --</option>
                <option v-for="promotion in promotions" :key="promotion.anneePro" :value="promotion.anneePro">
                  {{ promotion.anneePro }} - {{ promotion.siglePro }}
                </option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Dernier Diplôme</label>
              <input v-model="form.dernierDiplome" type="text" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Université</label>
              <input v-model="form.universite" type="text" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Est Diplômé *</label>
              <select v-model="form.estDiplome" class="form-select" required>
                <option value="O">Oui</option>
                <option value="N">Non</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Sigle Étudiant</label>
              <input v-model="form.sigleEtu" type="text" class="form-control">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Compte CRI</label>
              <input v-model="form.compteCri" type="text" class="form-control">
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
        <h5>Liste des Étudiants</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>N° Étudiant</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Sexe</th>
                <th>Email</th>
                <th>Promotion</th>
                <th>Est Diplômé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="etudiants.length === 0">
                <td colspan="8" class="text-center">Aucun étudiant trouvé</td>
              </tr>
              <tr v-for="etudiant in etudiants" :key="etudiant.noEtudiantNat">
                <td>{{ etudiant.noEtudiantNat }}</td>
                <td>{{ etudiant.nom }}</td>
                <td>{{ etudiant.prenom }}</td>
                <td>{{ etudiant.sexe }}</td>
                <td>{{ etudiant.email }}</td>
                <td>{{ getPromotionName(etudiant.anneePro) }}</td>
                <td>
                  <span :class="etudiant.estDiplome === 'O' ? 'badge bg-success' : 'badge bg-secondary'">
                    {{ etudiant.estDiplome === 'O' ? 'Oui' : 'Non' }}
                  </span>
                </td>
                <td>
                  <button @click="editEtudiant(etudiant)" class="btn btn-sm btn-warning me-2">
                    Modifier
                  </button>
                  <button @click="deleteEtudiant(etudiant.noEtudiantNat)" class="btn btn-sm btn-danger">
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
