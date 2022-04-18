import { MatchModel } from './../../../backend/src/models/soccer-bet/match.model';
import { MasterDataModel, CompetitionData } from './../../../backend/src/models/soccer-bet/master-data.model';
import { ResponseModel } from '../../../backend/src/models/response.model';
export class Httper{
    
    private baseUrl: string;

    constructor(baseUrl: string){
        this.baseUrl = baseUrl;

        this.get('/healt').then(response=>{
            console.log(response)
        }).catch(error=>{
            console.log(error)
        })
    }

    private post = async <T>(route:string, body:any, options?:any):Promise<ResponseModel<T>> =>{
        const response = await fetch(this.baseUrl+route, {
            method: 'POST',
            body
        })

        return await response.json();
    }

    private get = async <T>(route:string, options?:any):Promise<ResponseModel<T>> =>{
        const response = await fetch(this.baseUrl+route, {
            method: 'GET',
        })

        return await response.json();
    }

    public getMasterData = async() =>{
        const response = await this.get<MasterDataModel>('/get-master-data')
        return response.payload
    }

    public getMatchesForCompetition = async(competition:CompetitionData) =>{
        const response = await this.get<MatchModel[]>(`/get-matches/${competition.Id}`)
        return response.payload
    }
}
