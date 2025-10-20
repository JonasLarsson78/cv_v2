import { createWebHistory, createRouter } from 'vue-router'
import CV from '../components/CV.vue'


const routes = [
   { path: '/', component: CV },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})