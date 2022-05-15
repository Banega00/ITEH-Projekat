import { MasterDataModel } from './../../models/soccer-bet/master-data.model';
import { env } from '../wrappers/env-wrapper';
import { Httper } from './httper';
import { MatchesPerCompetition } from '../../models/soccer-bet/matches-per-competition.model';
export class SoccerHttpClient{

    private httper: Httper;
    constructor() {
        const soccerApiUrl = env.soccer.api;
        this.httper = new Httper(soccerApiUrl);
    }

    public getMasterData = async() => {
        const response:MasterDataModel = await this.httper.get("/MasterData/GetMasterData");
        return response;
    }

    //returns how many matches are there for each competition
    public getCompetitonFilter = async(timeFrameOption:number) => {
        const response:MatchesPerCompetition[] = await this.httper.get(`/Prematch/GetCompetitionFilter?timeFrameOption=${timeFrameOption}`);
        return response;
    }

    //get matches for specific competititon
    public getMatches = async(competitionId:number) => {
        const response = await this.httper.get(`/Prematch/GetCompetitionMatches?competitionId=${competitionId}`);
        return response;
    }
}