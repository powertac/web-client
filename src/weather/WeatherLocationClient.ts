import {RestClient} from "@/util/RestClient";
import type {WeatherLocationData} from "@/weather/domain/WeatherLocation";

export class WeatherLocationClient extends RestClient {

    public getAll(): Promise<WeatherLocationData[]> {
        return this.get("/locations/");
    }

}
