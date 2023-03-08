export class Broker {

    constructor(
        public id: string,
        public name: string,
        public version: string,
        public imageTag: string,
        public enabled: boolean) {}

}

export interface BrokerData extends NewBrokerData{
    id: string;
    enabled: boolean;
}

export interface NewBrokerData {
    name: string;
    version: string;
    imageTag: string;
}

export function buildBroker(data: BrokerData): Broker {
    return new Broker(
        data.id,
        data.name,
        data.version,
        data.imageTag,
        data.enabled);
}
