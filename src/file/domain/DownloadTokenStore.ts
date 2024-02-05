import {defineStore} from "pinia";
import {api} from "@/api";

export interface DownloadTokenStoreState {
    tokens: {[path: string]: string}
}

export const useDownloadTokenStore = defineStore({
    id: "download-tokens",
    state: () => ({tokens: {}} as DownloadTokenStoreState),
    getters: {
        findByPath: (state: DownloadTokenStoreState) => (path: string) => state.tokens[path] !== undefined ? state.tokens[path] : undefined
    },
    actions: {
        async fetch(path: string): Promise<void> {
            this.tokens[path] = await api.orchestrator.files.getDownloadToken(path);
        },
        async fetchMany(paths: string[]): Promise<void> {
            if (paths.length > 0) {
                const tokens = await api.orchestrator.files.getDownloadTokens(paths);
                Object.keys(tokens).forEach(path => this.tokens[path] = tokens[path]);
            }
        }
    }
});
