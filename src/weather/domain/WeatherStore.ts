import type {WeatherLocation, WeatherLocationData} from "@/weather/domain/WeatherLocation";
import {buildWeatherLocation} from "@/weather/domain/WeatherLocation";
import {defineStore} from "pinia";
import {createGetter} from "@/util/StoreUtils";

export interface WeatherStoreState {
    locations: {[name: string]: WeatherLocation}
}

export const useWeatherStore = defineStore({
    id: "weather",
    state: () => ({locations: {}} as WeatherStoreState),
    getters: {
        location: (state: WeatherStoreState) => createGetter("location", state.locations)
    },
    actions: {
        addLocation(data: WeatherLocationData): void {
            this.locations[data.name] = buildWeatherLocation(data);
        }
    }
});
