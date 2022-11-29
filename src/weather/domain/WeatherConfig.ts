import type {WeatherLocation} from "@/weather/domain/WeatherLocation";
import moment from "moment";
import {useWeatherStore} from "@/weather/domain/WeatherStore";

export class WeatherConfig {

    constructor(
        public location: WeatherLocation,
        public startDate: moment.Moment) {
    }

}

export interface WeatherConfigData {
    location: string;
    startDate: number;
}

export function buildWeatherConfig(data: WeatherConfigData): WeatherConfig {
    const location = useWeatherStore().location(data.location);
    if (null === location) {
        throw new Error("Could not find weather location: " + data.location);
    }
    return new WeatherConfig(
        location,
        moment(data.startDate));
}
