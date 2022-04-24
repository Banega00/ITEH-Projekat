import { isHttpError } from './../utils/http-clients/httper';
import { SoccerHttpClient } from './../utils/http-clients/soccer-http-client';
import { MasterDataModel } from '../models/soccer-bet/master-data.model';
import { ErrorStatusCode } from '../utils/status-codes';
import { Request, Response, NextFunction } from "express";
import { Httper } from "../utils/http-clients/httper";
import { SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";
import { UserProfileData } from '../models/responses/UserProfileData.response';
import { UserRepository } from '../repository/user-repository';
import { TicketItemModel } from '../../../frontend/src/models/ticket.model'

export class MainController{
    
    private soccerHttpClient:SoccerHttpClient;
    private userRepository:UserRepository;
    constructor() { 
        this.soccerHttpClient = new SoccerHttpClient();
        this.userRepository = new UserRepository();
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
    
    public getUserProfileData = async (request: Request, response:Response<UserProfileData>, next:NextFunction): Promise<any> => {
        try{
            const userProfileData = await this.userRepository.getUserProfileData(request.session.user!.id)
            if(!userProfileData) return sendResponse(response, 404, ErrorStatusCode.UnknownError, null);

            userProfileData.password = '';
            return sendResponse(response, 200, SuccessStatusCode.Success, userProfileData);
        }catch(error:any){
            return sendResponse(response, 400, ErrorStatusCode.UnknownError, null);
        }
    }
    
    public makeTransaction = async (request: Request, response:Response): Promise<any> => {
        const { id:userId } = request.session.user!;
        const { transactionPurpose, value } = request.body;
        try{
            
            await this.userRepository.makeTransaction(userId, value, transactionPurpose)

            return sendResponse(response, 200, SuccessStatusCode.Success);
        }catch(error:any){
            console.error(error);
            
            return sendResponse(response, 400, ErrorStatusCode.UnknownError);
        }
    }
    
    public submitTicket = async (request: Request, response:Response): Promise<any> => {
        const ticket: {selectedBets:TicketItemModel[]} = request.body.ticket;
        const ticketAmount: number = request.body.ticket;
    }
}