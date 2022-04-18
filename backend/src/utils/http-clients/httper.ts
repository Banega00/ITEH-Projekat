import fetch, { RequestInit, Response } from 'node-fetch';

class HTTPResponseError extends Error {
    public response: Response
	constructor(response:Response, ...args:any[]) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`);
		this.response = response;
	}
}

//if http request returned 4xx or 5xx
export const isHttpError = (error: any): error is HTTPResponseError =>{
    return error instanceof HTTPResponseError
}

//throws HttpResponseError if status of response is 4xx or 5xx
const checkStatus = (response:Response) => {
	if (response.ok) {
		// response.status >= 200 && response.status < 300
		return response;
	} else {
		throw new HTTPResponseError(response);
	}
}

export class Httper {

    private baseUrl: string;

    public constructor(baseURL: string) {
        this.baseUrl = baseURL
    }

    public async post(path: string, data: any, config?: RequestInit): Promise<any> {
        try {
            const response = await fetch(this.baseUrl + path, {method:'POST', body: data, ...config} )
            checkStatus(response);//throw Error if http error
            return response.json();
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    public async get(path: string, config?: RequestInit): Promise<any> {
        try {
            const response = await fetch(this.baseUrl + path, {method:'GET', ...config} )
            checkStatus(response);//throw Error if http error
            return response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
