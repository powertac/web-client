import type {Broker} from "@/broker/domain/Broker";
import type {WeatherConfig} from "@/weather/domain/WeatherConfig";
import type {WeatherConfigData} from "@/weather/domain/WeatherConfig";
import {useBrokerStore} from "@/broker/domain/BrokerStore";
import {buildWeatherConfig} from "@/weather/domain/WeatherConfig";
import type {SimulationServerVersion} from "@/simulation/domain/SimulationServerVersion";
import {useServerStore} from "@/simulation/domain/SimulationServerStore";

export class GameConfig {

    constructor(
        public readonly brokersIds: string[],
        public readonly parameters: { [key: string]: string },
        public readonly weather: WeatherConfig,
        public readonly seed: string|null, // FIXME : how are seeds represented?
        private readonly serverVersionId: string) {}

    get brokers(): Broker[] {
        const brokerStore = useBrokerStore();
        return this.brokersIds.map((id) => brokerStore.findById(id))
            .sort((a, b) => {
                const primary = a.name.localeCompare(b.name);
                return primary !== 0 ? primary : a.version.localeCompare(b.version)
            });
    }

    get serverVersion(): SimulationServerVersion {
        return useServerStore().findVersion(this.serverVersionId);
    }

}

export interface GameConfigData {
    brokerIds: string[];
    parameters: { [key: string]: string };
    weather: WeatherConfigData;
    seed: string|null;
    serverVersionId: string;
}

export function buildGameConfig(data: GameConfigData) {
    return new GameConfig(
        data.brokerIds,
        data.parameters,
        buildWeatherConfig(data.weather),
        data.seed !== undefined ? data.seed : null,
        data.serverVersionId);
}
