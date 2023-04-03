import {AuthClient} from "@/security/AuthClient";
import config from "@/config";
import {BrokerClient} from "@/broker/BrokerClient";
import {GameClient} from "@/game/GameClient";
import {BaselineClient} from "@/baseline/BaselineClient";
import {WeatherLocationClient} from "@/weather/WeatherLocationClient";
import {ParameterClient} from "@/simulation/ParameterClient";
import {TreatmentClient} from "@/treatment/TreatmentClient";
import {DockerClient} from "@/util/DockerClient";
import {FileClient} from "@/file/FileClient";

const orchestratorUrlLoader = () => config.services.orchestrator.url;
const weatherServerUrlLoader = () => config.services.weatherserver.url;

export const api = {
    orchestrator: {
        auth: new AuthClient(orchestratorUrlLoader),
        baselines: new BaselineClient(orchestratorUrlLoader),
        brokers: new BrokerClient(orchestratorUrlLoader),
        docker: new DockerClient(orchestratorUrlLoader),
        files: new FileClient(orchestratorUrlLoader),
        games: new GameClient(orchestratorUrlLoader),
        parameters: new ParameterClient(orchestratorUrlLoader),
        treatments: new TreatmentClient(orchestratorUrlLoader),
    },
    weather: {
        locations: new WeatherLocationClient(weatherServerUrlLoader)
    }
};
