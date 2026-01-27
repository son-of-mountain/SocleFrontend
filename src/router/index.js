import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import EnseignantView from '../views/EnseignantView.vue'
import FormationView from '../views/FormationView.vue'
import PromotionView from '../views/PromotionView.vue'
import EtudiantView from '../views/EtudiantView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/enseignants',
      name: 'enseignants',
      component: EnseignantView
    },
    {
      path: '/formations',
      name: 'formations',
      component: FormationView
    },
    {
      path: '/promotions',
      name: 'promotions',
      component: PromotionView
    },
    {
      path: '/etudiants',
      name: 'etudiants',
      component: EtudiantView
    }
  ]
})

export default router
