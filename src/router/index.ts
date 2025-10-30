import { createWebHistory, createRouter } from 'vue-router'
import CV from '../components/CV.vue'
import Projects from '../components/Projects.vue'


const routes = [
   { path: '/', component: CV },
   { path: '/projects', component: Projects },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})