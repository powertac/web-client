import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {createApp} from "vue";
import {createPinia} from "pinia";
import Application from "./application/views/Application.vue";
import router from "./router";
import axios from "axios";
import config from "@/config";
import "./styles/index.scss";
import "./fontawesome";
import "./store-update";

const serviceFileUrl = window.location.protocol + "//" + window.location.host + "/services.json";

axios.get(serviceFileUrl)
    .then(res => {
        config.services.orchestrator.url = res.data.orchestrator;
        config.services.weatherserver.url = res.data.weatherserver;
        const pinia = createPinia();
        createApp(Application)
            .use(pinia)
            .use(router)
            .component('icon', FontAwesomeIcon) // TODO - might be replaced by individual imports
            .mount("#app");
    }).catch(e => console.error(e));



