import type {Broker} from "@/broker/domain/Broker";
import type {WeatherConfig} from "@/weather/domain/WeatherConfig";
import type {WeatherConfigData} from "@/weather/domain/WeatherConfig";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {buildWeatherConfig} from "@/weather/domain/WeatherConfig";

export class GameConfig {

    constructor(
        public readonly brokers: Broker[],
        public readonly parameters: { [key: string]: string },
        public readonly weather: WeatherConfig,
        public readonly seed: string|null) { // FIXME : how are seeds represented?
    }

}

export interface GameConfigData {
    brokerIds: string[];
    parameters: { [key: string]: string };
    weather: WeatherConfigData;
    seed: string|null;
}

const brokerStore = useBrokerStore();

export function buildGameConfig(data: GameConfigData) {
    return new GameConfig(
        data.brokerIds.map((id) => brokerStore.findById(id)),
        data.parameters,
        buildWeatherConfig(data.weather),
        data.seed !== undefined ? data.seed : null);
}
