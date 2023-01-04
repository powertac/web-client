import {DateTime} from "luxon";

export class WeatherLocation {

    constructor(
        public readonly name: string,
        public readonly minReportTime: DateTime,
        public readonly maxReportTime: DateTime,
        public readonly minForecastTime: DateTime,
        public readonly maxForecastTime: DateTime) {
    }

    get minTime(): DateTime {
        return DateTime.max(this.minReportTime, this.minForecastTime);
    }

    get maxTime(): DateTime {
        return DateTime.min(this.maxReportTime, this.maxForecastTime);
    }

}

export interface WeatherLocationData {
    name: string;
    minReportTime: string;
    maxReportTime: string;
    minForecastTime: string;
    maxForecastTime: string;
}

export function buildWeatherLocation(data: WeatherLocationData): WeatherLocation {
    return new WeatherLocation(
        data.name,
        DateTime.fromISO(data.minReportTime),
        DateTime.fromISO(data.maxReportTime),
        DateTime.fromISO(data.minForecastTime),
        DateTime.fromISO(data.maxForecastTime));
}
