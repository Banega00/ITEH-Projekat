import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class Httper {

    private instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({ baseURL })
    }

    public async post(path: string, data: any, config?: AxiosRequestConfig): Promise<any> {
        const operation = this.instance.post.bind(this.instance, path, data, config);
        return await operation();
    }

    public async get(path: string, config?: AxiosRequestConfig): Promise<any> {
        const operation = this.instance.get.bind(this.instance, path, config);
        return await operation();
    }

}
