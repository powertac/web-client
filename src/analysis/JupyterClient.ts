import {RestClient} from "@/util/RestClient";
import type {JupyterInstance} from "@/analysis/domain/JupyterInstance";

export class JupyterClient extends RestClient {

    public getInstance(id: string): Promise<JupyterInstance|null> {
        return this.get("/jupyter/" + id);
    }

    public startGameNotebook(gameId: string): Promise<JupyterInstance> {
        return this.post("/jupyter/games/" + gameId, {gameId});
    }

    public startBaselineNotebook(baselineId: string): Promise<JupyterInstance> {
        return this.post("/jupyter/baselines/" + baselineId, {baselineId});
    }

    public startTreatmentNotebook(treatmentId: string): Promise<JupyterInstance> {
        return this.post("/jupyter/treatments/" + treatmentId, {treatmentId});
    }

    public stop(id: string): Promise<void> {
        return this.delete("/jupyter/" + id);
    }

}