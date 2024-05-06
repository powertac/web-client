export interface JupyterInstance {
    scopeId: string;
    port: number;
    token: string;
    isRunning: boolean;
    isReachable: boolean;
}

export enum JupyterServerStatus {
    NONE,
    STARTING,
    RUNNING,
    STOPPING
}