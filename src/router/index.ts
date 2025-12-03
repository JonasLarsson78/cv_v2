import { createWebHistory, createRouter } from 'vue-router'
import CV from '../components/CV.vue'
import Projects from '../components/Projects.vue'
import PrintCV from '../components/PrintCV.vue'


const routes = [
   { path: '/', component: CV },
   { path: '/projects', component: Projects },
   {path: '/print', component: PrintCV },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})