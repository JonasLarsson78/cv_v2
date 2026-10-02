import { createApp } from 'vue'

import App from './App.vue'
const { VITE_CV_VERSION } = import.meta.env
console.log(VITE_CV_VERSION)
if (VITE_CV_VERSION !== '2') {
  import('./style.scss')
  import('./background.js')
}

import router from './router/index.ts'

const app = createApp(App)

app.use(router)

app.mount('#app')
