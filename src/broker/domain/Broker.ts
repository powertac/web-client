export class Broker {

    constructor(
        public id: string|null,
        public name: string,
        public version: string,
        public imageTag: string,
        public enabled: boolean) {}

}

export interface BrokerData {
    id?: string;
    name: string;
    version: string;
    imageTag: string;
    enabled: boolean;
}

export function buildBroker(data: BrokerData): Broker {
    return new Broker(
        data.id !== undefined ? data.id : null,
        data.name,
        data.version,
        data.imageTag,
        data.enabled);
}
