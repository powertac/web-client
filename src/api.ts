import {AuthClient} from "@/security/AuthClient";
import config from "@/config";
import {BrokerClient} from "@/broker/BrokerClient";
import {GameClient} from "@/game/GameClient";
import {BaselineClient} from "@/baseline/BaselineClient";
import {WeatherLocationClient} from "@/weather/WeatherLocationClient";
import {ParameterClient} from "@/simulation/ParameterClient";
import {TreatmentClient} from "@/treatment/TreatmentClient";
import {DockerClient} from "@/util/DockerClient";
import {FileClient} from "@/file/FileClient";
import {GameRunClient} from "@/game/GameRunClient";
import {PathClient} from "@/application/PathClient";
import {UserClient} from "@/user/UserClient";
import {TaskClient} from "@/task/TaskClient";
import {LogProcessorClient} from "@/logprocessor/LogProcessorClient";
import {AnalysisClient} from "@/analysis/AnalysisClient";
import {RegistrationTokenClient} from "@/user/RegistrationTokenClient";

const orchestratorUrlLoader = () => config.services.orchestrator.url;
const weatherServerUrlLoader = () => config.services.weatherserver.url;

export const api = {
    orchestrator: {
        analysis: new AnalysisClient(orchestratorUrlLoader),
        auth: new AuthClient(orchestratorUrlLoader),
        baselines: new BaselineClient(orchestratorUrlLoader),
        brokers: new BrokerClient(orchestratorUrlLoader),
        docker: new DockerClient(orchestratorUrlLoader),
        files: new FileClient(orchestratorUrlLoader),
        games: new GameClient(orchestratorUrlLoader),
        parameters: new ParameterClient(orchestratorUrlLoader),
        paths: new PathClient(orchestratorUrlLoader),
        processors: new LogProcessorClient(orchestratorUrlLoader),
        registrations: new RegistrationTokenClient(orchestratorUrlLoader),
        runs: new GameRunClient(orchestratorUrlLoader),
        tasks: new TaskClient(orchestratorUrlLoader),
        treatments: new TreatmentClient(orchestratorUrlLoader),
        users: new UserClient(orchestratorUrlLoader)
    },
    weather: {
        locations: new WeatherLocationClient(weatherServerUrlLoader)
    }
};
