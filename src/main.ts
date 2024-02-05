import {createApp} from "vue";
import {createPinia} from "pinia";
import Application from "./application/views/Application.vue";
import "./styles/index.scss";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import "./fontawesome";
import router from "./router";
import axios from "axios";
import config from "@/config";

const serviceFileUrl = window.location.protocol + "//" + window.location.host + "/services.json"

axios.get(serviceFileUrl)
    .then(res => {
        config.services.orchestrator.url = res.data.orchestrator;
        config.services.weatherserver.url = res.data.weatherserver;
        createApp(Application)
            .use(createPinia())
            .use(router)
            .component('icon', FontAwesomeIcon) // TODO - might be replaced by individual imports
            .mount("#app");
    }).catch(e => console.error(e));



