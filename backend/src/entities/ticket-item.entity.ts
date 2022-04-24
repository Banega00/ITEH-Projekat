import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, CreateDateColumn, ManyToOne } from "typeorm";
import { TicketStatus } from "../models/ticket-status.enum";
import { MatchEntity } from "./match.entity";
import { TicketEntity } from "./ticket.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity()
export class TicketItemEntity{
    
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(() => TicketEntity, (ticket) => ticket.items)
    ticket: TicketEntity

    ticketId: number

    @Column({nullable: false})
    odd: number;

    @ManyToOne(() => MatchEntity, (match) => match.ticketItems)
    match: MatchEntity

    matchId: number

    constructor(obj?:Partial<TicketItemEntity>) {
        if(!obj) return;
        obj.ticket && (this.ticket = obj.ticket)
        obj.ticketId && (this.ticketId = obj.ticketId)
        obj.odd && (this.odd = obj.odd)
    }
}