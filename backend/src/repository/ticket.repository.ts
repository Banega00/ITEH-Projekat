import { Repository } from "typeorm/repository/Repository";
import { TicketModel } from "../../../frontend/src/models/ticket.model";
import { MatchEntity } from "../entities/match.entity";
import { TicketItemEntity } from "../entities/ticket-item.entity";
import { TicketEntity } from "../entities/ticket.entity";
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
}