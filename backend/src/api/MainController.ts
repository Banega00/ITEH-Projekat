import { isHttpError } from './../utils/http-clients/httper';
import { SoccerHttpClient } from './../utils/http-clients/soccer-http-client';
import { MasterDataModel } from '../models/soccer-bet/master-data.model';
import { ErrorStatusCode } from '../utils/status-codes';
import { Request, Response, NextFunction } from "express";
import { Httper } from "../utils/http-clients/httper";
import { SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";

export class MainController{
    private soccerHttpClient:SoccerHttpClient;
    constructor() { 
        this.soccerHttpClient = new SoccerHttpClient();
        const a = 10;
    }

    public healt = async (request: Request, response:Response, next:NextFunction): Promise<any> =>{
        sendResponse(response, 200, SuccessStatusCode.Success, {message: "Server is alive", time: `Current time is: ${new Date().toISOString()}`})
    }

    public getMasterData = async (request: Request, response:Response, next:NextFunction): Promise<any> =>{
        const {timeFrameOption:timeFrameOptionString} = request.query 
        
        const timeFrameOption = timeFrameOptionString ? +timeFrameOptionString : 4;
        try{
            if(timeFrameOption && (timeFrameOption < 0 || timeFrameOption > 4)){
                return sendResponse(response, 400, SuccessStatusCode.Success, 'Time frame option must be between 0 and 4');
            }
            const matchesPerCompetition = await this.soccerHttpClient.getCompetitonFilter(timeFrameOption ?? 4)
            const responseData = await this.soccerHttpClient.getMasterData()

            for(const competition of responseData.CompetitionsData.Competitions){
                const numberOfMatches = matchesPerCompetition.find(comp => comp.CompetitionId == competition.Id)
                
                if(numberOfMatches) competition.Matches = numberOfMatches.MatchCount;
            }

            return sendResponse(response, 200, SuccessStatusCode.Success, responseData);
        }catch(error:any){
            if(isHttpError(error)){
                const responseText = await error.response.text()
                return sendResponse(response, 400, ErrorStatusCode.UnknownError, responseText);
            }
            return sendResponse(response, 400, ErrorStatusCode.UnknownError, null);
        }
    }

    public getCompetitionFilter = async (request: Request, response:Response, next:NextFunction): Promise<any> => {
        const {timeFrameOptionString} = request.query 
        const timeFrameOption = timeFrameOptionString ? +timeFrameOptionString : 4;
        try{
            if(timeFrameOption && (timeFrameOption < 0 || timeFrameOption > 4)){
                return sendResponse(response, 400, SuccessStatusCode.Success, 'Time frame option must be between 0 and 4');
            }
            const responseData = await this.soccerHttpClient.getCompetitonFilter(timeFrameOption ?? 4)
            return sendResponse(response, 200, SuccessStatusCode.Success, responseData);
        }catch(error:any){
            if(isHttpError(error)){
                const responseText = await error.response.text()
                return sendResponse(response, 400, ErrorStatusCode.UnknownError, responseText);
            }
            return sendResponse(response, 400, ErrorStatusCode.UnknownError, null);
        }
    }

    public getMatches = async (request: Request, response:Response, next:NextFunction): Promise<any> => {
        let competitionId:string | number = request.params.competitionId;
        competitionId = +competitionId;
        if(!competitionId) 
            return sendResponse(response, 400, SuccessStatusCode.Success, 'CompetitonId must be and integer');

        try{
            const responseData = await this.soccerHttpClient.getMatches(competitionId)
            return sendResponse(response, 200, SuccessStatusCode.Success, responseData);
        }catch(error:any){
            if(isHttpError(error)){
                const responseText = await error.response.text()
                return sendResponse(response, 400, ErrorStatusCode.UnknownError, responseText);
            }
            return sendResponse(response, 400, ErrorStatusCode.UnknownError, null);
        }
    }
}