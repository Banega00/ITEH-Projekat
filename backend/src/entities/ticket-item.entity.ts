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
    name: string;

    @Column({nullable: false, type:'decimal'})
    odd: number;

    @Column({nullable: false})
    codeForPrinting: string;

    @ManyToOne(() => MatchEntity, (match) => match.ticketItems)
    match: MatchEntity

    matchId: number

    @Column({
        type:'jsonb'
    })
    betMetadata:{
        Id: number;
        Name: string;
        Description: string;
        OrderId: number;
        CodeForPrinting: string;
        BetGameId: number;
    }

    @Column({type: 'enum', enum: TicketStatus, nullable: false, default: TicketStatus.Active})
    status: TicketStatus;


    constructor(obj?:Partial<TicketItemEntity>) {
        if(!obj) return;
        obj.ticket && (this.ticket = obj.ticket)
        obj.ticketId && (this.ticketId = obj.ticketId)
        obj.odd && (this.odd = obj.odd)
        obj.codeForPrinting && (this.codeForPrinting = obj.codeForPrinting)
        obj.name && (this.name = obj.name)
        obj.betMetadata && (this.betMetadata = obj.betMetadata)
        obj.match && (this.match = obj.match)
        obj.status && (this.status = obj.status)
    }
}