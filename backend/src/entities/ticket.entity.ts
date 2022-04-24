import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, CreateDateColumn } from "typeorm";
import { TicketStatus } from "../models/ticket-status.enum";
import { TicketItemEntity } from "./ticket-item.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity()
export class TicketEntity{
    
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    date: Date;

    @Column({nullable: false})
    totalOdd: number;

    @Column({nullable: false})
    ticketAmount: number;

    @Column({nullable: false})
    maximumWinning: number;

    @Column({type: 'enum', enum: TicketStatus, nullable: false, default: TicketStatus.Active})
    status: TicketStatus;

    @OneToOne(() => TransactionEntity)
    @JoinColumn()
    transaction: TransactionEntity

    @OneToMany(() => TicketItemEntity, (item) => item.ticket)
    items: TicketItemEntity[]

    constructor(obj?:Partial<TicketEntity>) {
        if(!obj) return;
        obj.transaction && (this.transaction = obj.transaction)
        obj.maximumWinning && (this.maximumWinning = obj.maximumWinning)
        obj.ticketAmount && (this.ticketAmount = obj.ticketAmount)
        obj.totalOdd && (this.totalOdd = obj.totalOdd)
        obj.date && (this.date = obj.date)
        obj.status && (this.status = obj.status)
    }
}