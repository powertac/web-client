import {AuthClient} from "@/security/AuthClient";
import {config} from "@/application/config";
import {BrokerClient} from "@/broker/BrokerClient";
import {GameClient} from "@/game/GameClient";
import {BaselineClient} from "@/baseline/BaselineClient";
import {WeatherLocationClient} from "@/weather/WeatherLocationClient";

export const api = {
    orchestrator: {
        auth: new AuthClient(config.orchestrator.url),
        brokers: new BrokerClient(config.orchestrator.url),
        games: new GameClient(config.orchestrator.url),
        baselines: new BaselineClient(config.orchestrator.url),
    },
    weather: {
        locations: new WeatherLocationClient(config.weatherserver.url)
    }
};
