import type {WeatherLocation} from "@/weather/domain/WeatherLocation";
import {buildWeatherLocation} from "@/weather/domain/WeatherLocation";
import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/store/StoreUtils";
import {api} from "@/api/api";

export interface WeatherStoreState {
    locations: {[name: string]: WeatherLocation}
}

export const useWeatherStore = defineStore({
    id: "weather",
    state: () => ({locations: {}} as WeatherStoreState),
    getters: {
        findLocationByName: (state: WeatherStoreState) => createFindByIdGetter("location", state.locations),
        findAllLocations: (state: WeatherStoreState) => createFindAllGetter(state.locations)
    },
    actions: {
        async fetchAllLocations(): Promise<void> {
            (await api.weather.locations.getAll())
                .map((data) => buildWeatherLocation(data))
                .forEach((location) => this.locations[location.name] = location);
        }
    }
});
