import {RestClient} from "@/util/RestClient";

export class DockerClient extends RestClient {

    public getImageTags(): Promise<string[]> {
        return this.get("/v2/docker/image-tags/");
    }

}
