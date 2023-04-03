import {RestClient} from "@/util/RestClient";

export class FileClient extends RestClient {

    public getFileContents(path: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.client.get(this.baseUrl + '/files', {params: {path, offset: 0, length: 9999}})
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

}
