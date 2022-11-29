import type {Broker} from "@/broker/domain/Broker";
import type {WeatherConfig} from "@/weather/domain/WeatherConfig";
import type {WeatherConfigData} from "@/weather/domain/WeatherConfig";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {buildWeatherConfig} from "@/weather/domain/WeatherConfig";

export class GameConfig {

    constructor(
        public readonly id: string | null,
        public name: string | null,
        public brokers: Broker[],
        public parameters: { [key: string]: string },
        public weather: WeatherConfig,
        public seed: string|null) { // FIXME : how are seeds represented?
    }

}

export interface GameConfigData {
    id?: string;
    name?: string;
    brokerIds: string[];
    parameters: { [key: string]: string };
    weather: WeatherConfigData;
    seed?: string;
}

const brokerStore = useBrokerStore();

export function buildGameConfig(data: GameConfigData) {
    return new GameConfig(
        data.id !== undefined ? data.id : null,
        data.name !== undefined ? data.name : null,
        data.brokerIds.map((id) => brokerStore.findById(id)),
        data.parameters,
        buildWeatherConfig(data.weather),
        data.seed !== undefined ? data.seed : null
    )
}
