import {createApp} from "vue";
import {createPinia} from "pinia";
import Application from "./application/views/Application.vue";
import "./styles/index.scss";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import "./fontawesome";

const app = createApp(Application);

import router from "./router";
// FIXME : initialize authorization before creating the application
// TODO : investigate loading the state(s) from local storage for performance -> how to invalidate caches, though
const pinia = createPinia();

app.use(pinia)
    .use(router)
    .component('icon', FontAwesomeIcon)
    .mount("#app");
