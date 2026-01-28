<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import FieldTooltip from '../components/FieldTooltip.vue'
import { validateEtudiant } from '../utils/validators'

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
const selectedEtudiant = ref(null)
let pollingInterval = null

// Sorting
const sortColumn = ref('')
const sortOrder = ref('asc')

const sortedEtudiants = computed(() => {
  return [...etudiants.value].sort((a, b) => {
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

// Computed property to get promotion display name
const getPromotionName = (anneePro) => {
  const promotion = promotions.value.find(p => p.anneePro === anneePro)
  return promotion ? `${promotion.anneePro} - ${promotion.siglePro}` : anneePro
}

// Fetch all etudiants
const fetchEtudiants = async () => {
  try {
    const response = await fetch('/api/etudiants')
    const result = await response.json()
    etudiants.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des étudiants: ' + error.message
  }
}

// Fetch all promotions for dropdown
const fetchPromotions = async () => {
  try {
    const response = await fetch('/api/promotions')
    const result = await response.json()
    promotions.value = result
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des promotions: ' + error.message
  }
}

// Add new etudiant
const addEtudiant = async () => {
  try {
    const response = await fetch('/api/etudiants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Étudiant ajouté avec succès'
      resetForm()
      await fetchEtudiants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de l\'ajout de l\'étudiant'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de l\'ajout de l\'étudiant : ' + error.message
  }
}

// Update etudiant
const updateEtudiant = async () => {
  try {
    const response = await fetch('/api/etudiants', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Étudiant mis à jour avec succès'
      resetForm()
      await fetchEtudiants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la mise à jour de l\'étudiant'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la mise à jour de l\'étudiant : ' + error.message
  }
}

// Delete etudiant
const deleteEtudiant = async (noEtudiantNat) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) return
  
  try {
    const response = await fetch(`/api/etudiants/${noEtudiantNat}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    if (result.status === 'success') {
      successMessage.value = 'Étudiant supprimé avec succès'
      await fetchEtudiants()
      setTimeout(() => successMessage.value = '', 3000)
    } else {
      errorMessage.value = result.message || 'Échec de la suppression de l\'étudiant'
    }
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression de l\'étudiant : ' + error.message
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

  // Validation DB Front-end
  const errors = validateEtudiant(form.value)
  if (Object.keys(errors).length > 0) {
    const errorList = Object.entries(errors)
      .map(([field, msg]) => `• ${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`)
      .join('\n')
    errorMessage.value = "Veuillez corriger les erreurs suivantes :\n" + errorList
    return
  }

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
  
  pollingInterval = setInterval(fetchEtudiants, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<template>
  <div class="position-relative">
    <div class="page-background"></div>
    <h2 class="mb-4 text-black">Gestion des Étudiants</h2>

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
              <label class="form-label">
                No Étudiant National *
                <FieldTooltip text="Numéro National de l'étudiant" />
              </label>
              <input v-model="form.noEtudiantNat" type="text" class="form-control" :disabled="isEditing" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">
                Nom *
                <FieldTooltip text="Nom de l'étudiant" />
              </label>
              <input v-model="form.nom" type="text" class="form-control" required>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">
                Prénom *
                <FieldTooltip text="Prénom de l'étudiant" />
              </label>
              <input v-model="form.prenom" type="text" class="form-control" required>
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Sexe *
                <FieldTooltip text="Représente le sexe des personnes" />
              </label>
              <select v-model="form.sexe" class="form-select" required>
                <option value="H">H (Homme)</option>
                <option value="F">F (Femme)</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Date Naissance
                <FieldTooltip text="Date de naissance de l'étudiant" />
              </label>
              <input v-model="form.dateNaissance" type="date" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Lieu Naissance
                <FieldTooltip text="Lieu de naissance de l'étudiant" />
              </label>
              <input v-model="form.lieuNaissance" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Nationalité
                <FieldTooltip text="Nationalité de l'étudiant" />
              </label>
              <input v-model="form.nationalite" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">
                Email *
                <FieldTooltip text="Adresse email de l'étudiant" />
              </label>
              <input v-model="form.email" type="email" class="form-control" required>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">
                Situation
                <FieldTooltip text="Représente la situation de famille d'un étudiant (CEL: Célibataire, MAR: Marié, DIV: Divorcé)" />
              </label>
              <input v-model="form.situation" type="text" class="form-control" placeholder="CEL, MAR, DIV...">
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 mb-3">
              <label class="form-label">
                Adresse Permanente
                <FieldTooltip text="Rue de l'étudiant" />
              </label>
              <input v-model="form.permAdresse" type="text" class="form-control">
            </div>
          </div>

          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Code Postal
                <FieldTooltip text="Code Postal de l'étudiant" />
              </label>
              <input v-model="form.permCp" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Ville
                <FieldTooltip text="Ville de l'étudiant" />
              </label>
              <input v-model="form.permVille" type="text" class="form-control">
            </div>
            <div class="col-md-3 mb-3">
              <label class="form-label">
                Pays
                <FieldTooltip text="Pays de l'étudiant" />
              </label>
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
              <label class="form-label">
                Dernier Diplôme
                <FieldTooltip text="Dernier diplôme obtenu par l'étudiant" />
              </label>
              <input v-model="form.dernierDiplome" type="text" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">
                Dernier Diplôme
                <FieldTooltip text="Dernier diplôme obtenu par l'étudiant" />
              </label>
              <input v-model="form.dernierDiplome" type="text" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">
                Université
                <FieldTooltip text="Dernière université fréquentée par l'étudiant" />
              </label>
              <input v-model="form.universite" type="text" class="form-control">
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">
                Est Diplômé *
                <FieldTooltip text="Représente une valeur booléenne : O (Oui) ou N (Non)" />
              </label>
              <select v-model="form.estDiplome" class="form-select" required>
                <option value="O">Oui</option>
                <option value="N">Non</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">
                Sigle Étudiant
                <FieldTooltip text="Sigle de l'étudiant" />
              </label>
              <input v-model="form.sigleEtu" type="text" class="form-control">
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">
                Compte CRI
                <FieldTooltip text="Compte CRI de l'étudiant" />
              </label>
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
                <th @click="sortBy('noEtudiantNat')" style="cursor: pointer">
                  N° Étudiant <i v-if="sortColumn === 'noEtudiantNat'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('nom')" style="cursor: pointer">
                  Nom <i v-if="sortColumn === 'nom'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('prenom')" style="cursor: pointer">
                  Prénom <i v-if="sortColumn === 'prenom'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('sexe')" style="cursor: pointer">
                  Sexe <i v-if="sortColumn === 'sexe'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('email')" style="cursor: pointer">
                  Email <i v-if="sortColumn === 'email'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('anneePro')" style="cursor: pointer">
                  Promotion <i v-if="sortColumn === 'anneePro'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th @click="sortBy('estDiplome')" style="cursor: pointer">
                  Est Diplômé <i v-if="sortColumn === 'estDiplome'" :class="sortOrder === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill'"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="etudiants.length === 0">
                <td colspan="8" class="text-center">Aucun étudiant trouvé</td>
              </tr>
              <tr v-for="etudiant in sortedEtudiants" :key="etudiant.noEtudiantNat">
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
                  <button @click="selectedEtudiant = etudiant" data-bs-toggle="modal" data-bs-target="#viewEtudiantModal" class="btn btn-sm btn-info me-2" title="Voir détails">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button @click="editEtudiant(etudiant)" class="btn btn-sm btn-warning me-2" title="Modifier">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button @click="deleteEtudiant(etudiant.noEtudiantNat)" class="btn btn-sm btn-danger" title="Supprimer">
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
    <div class="modal fade" id="viewEtudiantModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de l'Étudiant</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedEtudiant">
            <div class="row">
              <div class="col-md-6">
                <p><strong>N° National:</strong> {{ selectedEtudiant.noEtudiantNat }}</p>
                <p><strong>Nom:</strong> {{ selectedEtudiant.nom }}</p>
                <p><strong>Prénom:</strong> {{ selectedEtudiant.prenom }}</p>
                <p><strong>Sexe:</strong> {{ selectedEtudiant.sexe }}</p>
                <p><strong>Date de Naissance:</strong> {{ selectedEtudiant.dateNaissance }}</p>
                <p><strong>Lieu de Naissance:</strong> {{ selectedEtudiant.lieuNaissance }}</p>
                <p><strong>Nationalité:</strong> {{ selectedEtudiant.nationalite }}</p>
                <p><strong>Situation:</strong> {{ selectedEtudiant.situation }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Email:</strong> {{ selectedEtudiant.email }}</p>
                <p><strong>Adresse:</strong> {{ selectedEtudiant.permAdresse }}</p>
                <p><strong>Code Postal:</strong> {{ selectedEtudiant.permCp }}</p>
                <p><strong>Ville:</strong> {{ selectedEtudiant.permVille }}</p>
                <p><strong>Pays:</strong> {{ selectedEtudiant.permPays }}</p>
                <p><strong>Dernier Diplôme:</strong> {{ selectedEtudiant.dernierDiplome }}</p>
                <p><strong>Université:</strong> {{ selectedEtudiant.universite }}</p>
                <p><strong>Est Diplômé:</strong> {{ selectedEtudiant.estDiplome === 'O' ? 'Oui' : 'Non' }}</p>
              </div>
            </div>
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
  background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Chateau_de_Brest_cote_Penfeld.jpg/1920px-Chateau_de_Brest_cote_Penfeld.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(0.5);
  z-index: -1;
}
</style>
