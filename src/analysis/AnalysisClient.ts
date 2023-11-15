import {RestClient} from "@/util/RestClient";
import type {Analyzer} from "@/analysis/domain/Analyzer";
import type {AnalyzerArtifact} from "@/analysis/domain/AnalyzerArtifact";

export class AnalysisClient extends RestClient {

    public available(): Promise<Analyzer[]> {
        return this.get("/v2/analysis/");
    }

    public runBaselineAnalyzer(baselineId: string, analyzerName: string): Promise<any> {
        return this.post("/v2/analysis/baselines/" + baselineId + "/" + analyzerName, undefined);
    }

    public getBaselineArtifact(baselineId: string, analyzerName: string): Promise<AnalyzerArtifact> {
        return this.get("/v2/analysis/baselines/" + baselineId + "/" + analyzerName);
    }

    public runTreatmentAnalyzer(treatmentId: string, analyzerName: string): Promise<any> {
        return this.post("/v2/analysis/treatments/" + treatmentId + "/" + analyzerName, undefined);
    }

    public getTreatmentArtifacts(treatmentId: string, analyzerName: string): Promise<AnalyzerArtifact> {
        return this.get("/v2/analysis/treatments/" + treatmentId + "/" + analyzerName);
    }

}