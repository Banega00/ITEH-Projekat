import { Request, Response } from "express";
import { TicketRepository } from "../repository/ticket.repository";
import { UserRepository } from "../repository/user-repository";
import { ErrorStatusCode, SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";

export class AdminController{
    private userRepository:UserRepository;
    private ticketRepository:TicketRepository;
    constructor() { 
        this.userRepository = new UserRepository()
        this.ticketRepository = new TicketRepository()
    }

    public getUsers = async (request: Request, response:Response): Promise<any> => {
        try{
            const users = await this.userRepository.getUsers();
            sendResponse(response, 200, SuccessStatusCode.Success, users);
        }catch(error){
            sendResponse(response, 400, ErrorStatusCode.Failure);
        }
    }

    public getStats = async (request: Request, response:Response): Promise<any> => {
        const stats:{[key: string]: number | undefined} = {
            users: undefined,
            tickets: undefined,
            bets: undefined,
            successful_tickets: undefined,
            successful_bets: undefined
        }
        try{
            stats.users = await this.userRepository.getUserCount();
            stats.tickets = await this.ticketRepository.getTicketCount();
            stats.successful_tickets = +(await this.ticketRepository.getSuccessfulTicketsPercentage());
            stats.bets = await this.ticketRepository.getTicketItemCount();
            stats.successful_bets = +(await this.ticketRepository.getSuccessfulBetsPercentage());

            sendResponse(response, 200, SuccessStatusCode.Success, stats);
        }catch(error){
            sendResponse(response, 400, ErrorStatusCode.Failure);
        }
    }
}