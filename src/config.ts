import axios, {AxiosError, type AxiosResponse} from "axios";

interface ServicesConfig {
    orchestrator: string,
    weatherserver: string
}

interface Service {
    url: string;
}

interface Services {
    orchestrator: Service;
    weatherserver: Service;
}

class ConfigurationProvider {

    public services: Services;
    public auth: {secret: string};

    constructor() {
        this.services = {
            orchestrator: {url: import.meta.env.VITE_ORCHESTRATOR_URL},
            weatherserver: {url: import.meta.env.VITE_WEATHERSERVER_URL}
        };
        this.auth = {secret: import.meta.env.VITE_TOKEN_SECRET};
    }

    public load(): Promise<void> {
        const servicesFileUrl = "http://" + window.location.host + "/services.json"
        return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
            axios.get(servicesFileUrl)
                .then((response: AxiosResponse<ServicesConfig>) => {
                    this.services.orchestrator = { url: response.data.orchestrator }
                    this.services.weatherserver = { url: response.data.weatherserver }
                    resolve();
                })
                .catch((error: AxiosError) => reject(error));
            return;
        });
    }

}

const config = new ConfigurationProvider();
export default config;
