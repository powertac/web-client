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

}

const config = new ConfigurationProvider();
export default config;
