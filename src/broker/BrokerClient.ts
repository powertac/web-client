import {RestClient} from "@/util/RestClient";
import type {Broker, BrokerData} from "@/broker/domain/Broker";

export class BrokerClient extends RestClient {

    public getAll(): Promise<BrokerData[]> {
        return this.get("/brokers/");
    }

    public create(broker: Broker): Promise<void> {
        return this.post("/brokers/", broker);
    }

}
