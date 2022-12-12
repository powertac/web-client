import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Application from './application/views/Application.vue'
import router from './router'
import './styles/index.scss'

const pinia = createPinia();

// FIXME : initialize authorization before creating the application
// TODO : investigate loading the state(s) from local storage for performance -> how to invalidate caches, though

createApp(Application)
    .use(pinia)
    .use(router)
    .mount("#app");
