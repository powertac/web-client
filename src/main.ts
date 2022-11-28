import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Application from './application/views/Application.vue'
import router from './router'
import './styles/index.scss'

const app = createApp(Application)
app.use(createPinia())
app.use(router)
app.mount('#app')
