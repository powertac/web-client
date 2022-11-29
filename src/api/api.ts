import {AuthClient} from "@/security/AuthClient";
import {config} from "@/application/config";
import {BrokerClient} from "@/broker/BrokerClient";

export const api = {
    orchestrator: {
        auth: new AuthClient(config.orchestrator.url),
        brokers: new BrokerClient(config.orchestrator.url)
    },
};
