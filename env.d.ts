/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ORCHESTRATOR_URL: string;
    readonly VITE_WEATHERSERVER_URL: string;
    readonly VITE_TOKEN_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
