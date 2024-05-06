import {defineStore} from "pinia";
import {DateTime} from "luxon";

export interface ApplicationStoreState {
    clock: DateTime;
    clockStarted: boolean;
}

export const useApplicationStore = defineStore({
    id: "application",
    state: () => ({clock: DateTime.now()} as ApplicationStoreState),
    getters: {
        getTime: (state: ApplicationStoreState) => state.clock
    },
    actions: {
        startClock(): void {
            if (!this.clockStarted) {
                this.clockStarted = true;
                setInterval(() => this.clock = DateTime.now(), 500);
            } else {
                console.warn("clock already started");
            }
        }
    }
});
