export class SyncGroup {

    private promises: Promise<any>[] = [];
    private locked: boolean = false;

    public add(promise: Promise<any>): void {
        if (this.locked) {
            throw new Error("cannot add to running SyncGroup");
        }
        this.promises.push(promise);
    }

    public async wait(): Promise<void> {
        this.locked = true;
        // TODO : check if this actually works as intended (meaning that promises are created on call and not on
        //        await/.then() invocation)
        for (let i=0; i < this.promises.length; i++) {
            await this.promises[i];
        }
    }

}
