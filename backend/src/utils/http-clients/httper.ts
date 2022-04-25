import fetch, { RequestInit, Response } from 'node-fetch';
import https from 'https';
import { MatchResulstResponse } from '../../models/responses/match-result.response';

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

    httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

    public constructor(baseURL: string) {
        this.baseUrl = baseURL
    }

    public async post(path: string, data: any, config?: RequestInit): Promise<any> {
        try {
            const response = await fetch(this.baseUrl + path, {method:'POST', body: JSON.stringify(data), ...config, agent:this.httpsAgent} )
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


    public async liveScoreForDay(dateString:string): Promise<MatchResulstResponse>{
        const response = await this.post('/live_score_danas/', {today: dateString}, {headers:{'Content-Type':'application/json'}});
        return response;
    }
}
