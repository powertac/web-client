import {AuthClient} from "@/security/AuthClient";
import {config} from "@/config";
import {BrokerClient} from "@/broker/BrokerClient";
import {GameClient} from "@/game/GameClient";
import {BaselineClient} from "@/baseline/BaselineClient";
import {WeatherLocationClient} from "@/weather/WeatherLocationClient";
import {ParameterClient} from "@/simulation/ParameterClient";
import {TreatmentClient} from "@/treatment/TreatmentClient";

export const api = {
    orchestrator: {
        auth: new AuthClient(config.orchestrator.url),
        baselines: new BaselineClient(config.orchestrator.url),
        brokers: new BrokerClient(config.orchestrator.url),
        games: new GameClient(config.orchestrator.url),
        parameters: new ParameterClient(config.orchestrator.url),
        treatments: new TreatmentClient(config.orchestrator.url),
    },
    weather: {
        locations: new WeatherLocationClient(config.weatherserver.url)
    }
};
