import type {DateTime} from "luxon";

interface UpdatableStoreState {
    lastUpdate: DateTime|null;
}

const isReady = (state: UpdatableStoreState) => state.lastUpdate !== null;