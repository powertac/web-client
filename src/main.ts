import {createApp} from "vue";
import {createPinia} from "pinia";
import Application from "./application/views/Application.vue";
import "./styles/index.scss";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import "./fontawesome";
import router from "./router";

const app = createApp(Application);
const pinia = createPinia();

app.use(pinia)
    .use(router)
    .component('icon', FontAwesomeIcon)
    .mount("#app");

