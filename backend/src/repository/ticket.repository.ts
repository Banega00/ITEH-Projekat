import { EntityManager } from "typeorm";
import { Repository } from "typeorm/repository/Repository";
import { TicketModel } from "../../../frontend/src/models/ticket.model";
import { MatchEntity } from "../entities/match.entity";
import { TicketItemEntity } from "../entities/ticket-item.entity";
import { TicketEntity } from "../entities/ticket.entity";
import { UserEntity } from "../entities/user.entity";
import { TicketStatus } from "../models/ticket-status.enum";
import { dataSource } from "./db-connection";

export class TicketRepository{
    
    

    ticketRepository: Repository<TicketEntity>;
    ticketItemRepository: Repository<TicketItemEntity>;
    matchRepository: Repository<MatchEntity>;
    constructor() {
        this.ticketRepository = dataSource.getRepository<TicketEntity>(TicketEntity)        
        this.ticketItemRepository = dataSource.getRepository<TicketItemEntity>(TicketItemEntity)        
        this.matchRepository = dataSource.getRepository<MatchEntity>(MatchEntity)        
    }

    getUsersActiveTickets = async (user: UserEntity, entityManager?: EntityManager) => {
        const manager = entityManager ?? this.ticketRepository.manager

        return await manager.find(TicketEntity, {where: {userId: user.id, status: TicketStatus.Active}, relations:['items','items.match']})
    }

    saveTicket = async (ticket: TicketEntity, entityManager?: EntityManager) => {
        const manager = entityManager ?? this.ticketRepository.manager;
        return await manager.save(ticket);
    }
}