import type {Broker} from "@/broker/domain/Broker";
import type {WeatherConfigData} from "@/weather/domain/WeatherConfig";

export class GameValidator {

    static gameName(gameName: string): boolean {
        return gameName.length > 5;
    }

    static brokers(brokers: Broker[]): boolean {
        return brokers.length > 0;
    }

    static weather(weatherConfig: WeatherConfigData): boolean {
        return weatherConfig.location !== undefined
            && weatherConfig.startTime !== undefined;
    }

}
