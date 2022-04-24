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
import { dataSource } from '../repository/db-connection';
import { TicketEntity } from '../entities/ticket.entity';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionPurpose } from '../models/transaction-purpose.enum';
import { TicketStatus } from '../models/ticket-status.enum';
import { MatchEntity } from '../entities/match.entity';
import { TicketItemEntity } from '../entities/ticket-item.entity';
import { UserEntity } from '../entities/user.entity';

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
        const ticketAmount: number = request.body.ticketAmount;
        if(!request.session.user){
            return sendResponse(response, 401, ErrorStatusCode.Unauthorized);
        }

        try{
            if(ticketAmount >= request.session.user.balance){
               return sendResponse(response, 400, ErrorStatusCode.InsufficientMoney);
            }

            dataSource.transaction(async transactionalEntityManager => {
                const user = await transactionalEntityManager.findOne(UserEntity, {where: {id: request.session.user!.id}})
                if(!user) throw new Error("USER NOT FOUND!")
                const transactionEntity = new TransactionEntity({transactionPurpose:TransactionPurpose.TICKET, value:(-1)*ticketAmount, userId: user.id})
                await transactionalEntityManager.save(transactionEntity);
                user.balance = user.balance + transactionEntity.value;
                await transactionalEntityManager.save(user);

                const totalOdd = ticket.selectedBets.reduce(function (accumulator, currentValue) {
                    return accumulator * currentValue.selectedBet.Odds;
                  }, 1);
                const maximumWinning = totalOdd * ticketAmount;
                const ticketEntity = new TicketEntity({transaction: transactionEntity, totalOdd, maximumWinning, ticketAmount, status: TicketStatus.Active, user: user})
            
                await transactionalEntityManager.save(ticketEntity);

                for(const ticketItem of ticket.selectedBets){
                    let match = await transactionalEntityManager.findOne(MatchEntity, {where: {Id: ticketItem.Id}})
                    if(!match){
                        const {FavouriteBets, AllBets, selectedBet, StartDate ,...matchData } = ticketItem;
                        match = await transactionalEntityManager.save(new MatchEntity({...matchData, StartDate: new Date(StartDate)}))
                    }

                    const savedTicketItem = await transactionalEntityManager.save(new TicketItemEntity({matchId:match.Id, match:match, ticket: ticketEntity, odd: ticketItem.selectedBet.Odds, betMetadata: ticketItem.selectedBet.BetMetadata, codeForPrinting:ticketItem.selectedBet.BetMetadata?.CodeForPrinting, name: ticketItem.selectedBet.BetMetadata?.Name, ticketId: ticketEntity.id}))
                    console.log(savedTicketItem)
                }
            });
            return sendResponse(response, 200, SuccessStatusCode.Success);
        }catch(error){
            console.log(error)
            return sendResponse(response, 500, ErrorStatusCode.UnknownError);
        }
    }
}