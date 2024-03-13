export interface JupyterInstance {
    scopeId: string;
    port: number;
    token: string;
    isRunning: boolean;
}