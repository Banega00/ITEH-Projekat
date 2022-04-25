import { MatchEntity } from "../entities/match.entity";
import { TicketItemEntity } from "../entities/ticket-item.entity";
import { TicketEntity } from "../entities/ticket.entity";
import { TransactionEntity } from "../entities/transaction.entity";
import { UserEntity } from "../entities/user.entity"
import { TicketStatus } from "../models/ticket-status.enum";
import { TransactionPurpose } from "../models/transaction-purpose.enum";
import { dataSource } from "../repository/db-connection";
import { TicketRepository } from "../repository/ticket.repository";
import { UserRepository } from "../repository/user-repository"
import { Httper } from "./http-clients/httper";


//In order to calculate ticket item, ticket item has to has match whit match result - match is finished
export const calculateTicketItemResult = (ticketItem: TicketItemEntity) =>{
    if(!ticketItem?.match?.matchResult) throw new Error("MATCH RESULT MISSING")

    const matchResult = ticketItem.match.matchResult;
    if(ticketItem.name == '1' && ticketItem.codeForPrinting == 'KI 1'){
        //domacin pobedjuje
        if(matchResult.d_k > matchResult.g_k){
            ticketItem.status = TicketStatus.Successful
        }
    }else if(ticketItem.name == 'X' && ticketItem.codeForPrinting == 'KI X'){
        //nereseno
        if(matchResult.d_k == matchResult.g_k){
            ticketItem.status = TicketStatus.Successful
        }
    }else if(ticketItem.name == '2' && ticketItem.codeForPrinting == 'KI 2'){
        //gost pobedjuje
        if(matchResult.d_k < matchResult.g_k){
            ticketItem.status = TicketStatus.Successful
        }
    }
}

export const updateTicket = (ticket: TicketEntity) =>{
    for(const ticketItem of ticket.items){
        
        if(!ticketItem.match.matchResult) continue;

        calculateTicketItemResult(ticketItem);
    }

    const allSuccessful = ticket.items.every(ticketItem => ticketItem.status == TicketStatus.Successful);
    if(allSuccessful) ticket.status = TicketStatus.Successful;

    const anyMissed = ticket.items.some(ticketItem => ticketItem.status == TicketStatus.Missed)
    if(anyMissed) ticket.status = TicketStatus.Missed;
}


export const updapteUserTickets = async (userId: UserEntity['id']) =>{
    try{
        const userRepository = new UserRepository();
        const ticketRepository = new TicketRepository();
        const user = await userRepository.getUser({id: userId});
        if(!user) throw new Error("USER NOT FOUND")

        const tickets = await ticketRepository.getUsersActiveTickets(user);

        dataSource.transaction(async transactionalEntityManager => {
            for(const ticket of tickets){
                updateTicket(ticket);
                if(ticket.status == TicketStatus.Successful){
                    const transaction = new TransactionEntity({transactionPurpose:TransactionPurpose.TICKET, user: user, value: ticket.ticketAmount * ticket.totalOdd})
                    await transactionalEntityManager.save(transaction)
                }
                await ticketRepository.saveTicket(ticket, transactionalEntityManager)
            }
        })

        
    // throw Error("in progres...")

    }catch(error){
        console.log(error);
        throw error;
    }
}

export const updateFinishedMatches = async() =>{
    try{
        const httpService = new Httper('https://rezultati.soccerbet.rs')
        const uniqueDays:Date[] = [];
        dataSource.transaction(async transactionalEntityManager => {
            const unfinishedMatches = await transactionalEntityManager.find(MatchEntity, {where: {matchResult: undefined}})
        
            for(const match of unfinishedMatches){
                const dayExists = uniqueDays.some(day => {
                    return ( 
                        match.StartDate.getFullYear() == day.getFullYear() &&
                        match.StartDate.getMonth() == day.getMonth() &&
                        match.StartDate.getDate() == day.getDate() 
                    )
                })

                if(!dayExists) uniqueDays.push(new Date(match.StartDate.getFullYear(), match.StartDate.getMonth(), match.StartDate.getDate()))
            }

            for(const day of uniqueDays){
                const resultResponse = await httpService.liveScoreForDay(day.toISOString())
    
                for(const sportKey in resultResponse.mec_zavrsenos){
                    for(const matchResult of resultResponse.mec_zavrsenos[sportKey]){
                        const match = unfinishedMatches.find(match => match.Code == matchResult.sifra);
                        if(match){
                            match.matchResult = matchResult
                        }
                    }
                }
            }
        });
    }catch(error){
        console.log(error);
    }
}


