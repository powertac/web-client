import {RestClient} from "@/api/RestClient";
import type {Broker} from "@/broker/domain/Broker";

export class BrokerClient extends RestClient {

    public getAll(): Promise<Broker[]> {
        return this.get("/brokers/");
    }

    public create(broker: Broker): Promise<void> {
        return this.post("/brokers/", broker);
    }

}
