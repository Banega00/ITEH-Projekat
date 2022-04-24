import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, CreateDateColumn } from "typeorm";
import { TicketStatus } from "../models/ticket-status.enum";
import { TicketItemEntity } from "./ticket-item.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity()
export class MatchEntity{
    
    @PrimaryGeneratedColumn()
    id:number;

    @OneToMany(() => TicketItemEntity, (ticketItem) => ticketItem.match) // note: we will create author property in the Photo class below
    ticketItems: TicketItemEntity[]

    constructor(obj?:Partial<MatchEntity>) {
        if(!obj) return;
        // obj.transaction && (this.transaction = obj.transaction)
        // obj.maximumWinning && (this.maximumWinning = obj.maximumWinning)
        // obj.ticketAmount && (this.ticketAmount = obj.ticketAmount)
        // obj.totalOdd && (this.totalOdd = obj.totalOdd)
        // obj.date && (this.date = obj.date)
        // obj.status && (this.status = obj.status)
    }
}