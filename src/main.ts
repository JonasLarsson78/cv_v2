import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import './background.js'
import router from './router/index.ts'

const app = createApp(App)

app.use(router)

app.mount('#app')
