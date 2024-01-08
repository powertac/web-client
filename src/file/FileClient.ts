import {RestClient} from "@/util/RestClient";

export class FileClient extends RestClient {

    public getFileContents(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client.get(this.baseUrl + '/files', {params: {path, offset: 0, length: 9999}})
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    public getDownloadToken(path: string): Promise<string> {
        return this.post("/files/download/" + path, undefined);
    }

    public getDownloadTokens(paths: string[]): Promise<{[path: string]: string}> {
        return this.post("/files/download/", paths);
    }

}
