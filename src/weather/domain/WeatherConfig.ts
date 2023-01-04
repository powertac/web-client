import type {WeatherLocation} from "@/weather/domain/WeatherLocation";
import {useWeatherStore} from "@/weather/domain/WeatherStore";
import {DateTime} from "luxon";

export class WeatherConfig {

    constructor(
        public location: WeatherLocation,
        public startDate: DateTime) {
    }

    get data(): WeatherConfigData {
        return {
            location: this.location.name,
            startTime: this.startDate.toMillis()
        };
    }

}

export interface WeatherConfigData {
    location: string;
    startTime: number;
}

export function buildWeatherConfig(data: WeatherConfigData): WeatherConfig {
    const location = useWeatherStore().findLocationByName(data.location);
    if (null === location) {
        throw new Error("Could not find weather location: " + data.location);
    }
    return new WeatherConfig(
        location,
        DateTime.fromMillis(data.startTime));
}
