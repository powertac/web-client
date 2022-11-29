import moment from "moment";

export class WeatherLocation {

    constructor(
        public readonly name: string,
        public readonly minReportTime: moment.Moment,
        public readonly maxReportTime: moment.Moment,
        public readonly minForecastTime: moment.Moment,
        public readonly maxForecastTime: moment.Moment) {
    }

    get minTime(): moment.Moment {
        return this.minReportTime.isAfter(this.minForecastTime) ? this.minReportTime : this.minForecastTime;
    }

    get maxTime(): moment.Moment {
        return this.maxReportTime.isBefore(this.maxForecastTime) ? this.maxReportTime : this.maxForecastTime;
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
        moment(data.minReportTime),
        moment(data.maxReportTime),
        moment(data.minForecastTime),
        moment(data.maxForecastTime));
}
