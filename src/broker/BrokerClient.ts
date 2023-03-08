import {RestClient} from "@/util/RestClient";
import type {BrokerData, NewBrokerData} from "@/broker/domain/Broker";

export class BrokerClient extends RestClient {

    public getAll(): Promise<BrokerData[]> {
        return this.get("/brokers/");
    }

    public create(newBroker: NewBrokerData): Promise<void> {
        return this.post("/brokers/", newBroker);
    }

}
