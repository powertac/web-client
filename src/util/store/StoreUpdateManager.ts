interface UpdateInstance {
    cb: () => Promise<any>;
    tickInterval: number;
    isBlocked: boolean;
}

class StoreUpdateManager {

    private cbs = new Map<string, UpdateInstance>();
    private tick = 0;
    private intervalId: number|undefined;

    public add(name: string, cb: Promise<any>, tickInterval: number = 1): void {
        this.cbs.set(name, {cb, tickInterval, isBlocked: false});
    }

    public remove(name: string): void {
        this.cbs.delete(name);
    }

    public start(): void {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.nextTick.bind(this), 1000);
    }

    public stop(): void {
        clearInterval(this.intervalId);
    }

    private nextTick(): void {
        this.tick = this.tick < Number.MAX_SAFE_INTEGER ? this.tick + 1 : 0;
        this.cbs.forEach((instance, name) => {
            if (instance !== undefined && !instance.isBlocked && (this.tick % instance.tickInterval) === 0) {
                instance.isBlocked = true;
                instance.cb()
                    .catch(e => this.handleError(name, e))
                    .finally(() => instance.isBlocked = false);
            }
        });
    }

    private handleError(name: string, error: Error): void {
        console.error("unable to update " + name, error);
    }

}

export const updateManager = new StoreUpdateManager();