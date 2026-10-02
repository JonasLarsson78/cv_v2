import { createWebHistory, createRouter } from 'vue-router'
import CV from '../components/CV.vue'
import CV2 from '../components_CV2/CV.vue'
//import Projects from '../components/Projects.vue'
import PrintCV from '../components/PrintCV.vue'
const { VITE_CV_VERSION } = import.meta.env

const routes = [
  { path: '/', component: VITE_CV_VERSION === '2' ? CV2 : CV },
  //{ path: '/projects', component: Projects },
  { path: '/print', component: PrintCV },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
