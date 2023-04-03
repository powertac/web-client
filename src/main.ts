import {createApp} from "vue";
import {createPinia} from "pinia";
import Application from "./application/views/Application.vue";
import "./styles/index.scss";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import "./fontawesome";

const app = createApp(Application);
const pinia = createPinia();
import router from "./router";
import config from "@/config";

function init(): void {
    app.use(pinia)
        .use(router)
        .component('icon', FontAwesomeIcon)
        .mount("#app");
}

config.load()
    .then(init)
    .catch((error) => {
        console.warn("using local config")
        init();
    });

