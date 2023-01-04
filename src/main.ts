import { createApp } from "vue";
import { createPinia } from "pinia";
import Application from "./application/views/Application.vue";
import router from "./router";
import "./styles/index.scss";

// FIXME : initialize authorization before creating the application
// TODO : investigate loading the state(s) from local storage for performance -> how to invalidate caches, though
const pinia = createPinia();
createApp(Application)
    .use(pinia)
    .use(router)
    .mount("#app");
