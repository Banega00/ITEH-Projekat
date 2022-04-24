import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, CreateDateColumn, ManyToOne } from "typeorm";
import { TicketStatus } from "../models/ticket-status.enum";
import { TicketItemEntity } from "./ticket-item.entity";
import { TransactionEntity } from "./transaction.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class TicketEntity{
    
    @PrimaryGeneratedColumn()
    id:number;

    @CreateDateColumn()
    date: Date;

    @Column({nullable: false, type:'decimal'})
    totalOdd: number;

    @Column({nullable: false, type:'decimal'})
    ticketAmount: number;

    @Column({nullable: false, type:'decimal'})
    maximumWinning: number;

    @Column({type: 'enum', enum: TicketStatus, nullable: false, default: TicketStatus.Active})
    status: TicketStatus;

    @OneToOne(() => TransactionEntity)
    @JoinColumn()
    transaction: TransactionEntity

    @OneToMany(() => TicketItemEntity, (item) => item.ticket)
    items: TicketItemEntity[]

    @ManyToOne(() => UserEntity, (user) => user.tickets)
    user: UserEntity

    userId: number;

    constructor(obj?:Partial<TicketEntity>) {
        if(!obj) return;
        obj.transaction && (this.transaction = obj.transaction)
        obj.maximumWinning && (this.maximumWinning = obj.maximumWinning)
        obj.ticketAmount && (this.ticketAmount = obj.ticketAmount)
        obj.totalOdd && (this.totalOdd = obj.totalOdd)
        obj.date && (this.date = obj.date)
        obj.status && (this.status = obj.status)
        obj.user && (this.user = obj.user)
        obj.userId && (this.userId = obj.userId)
    }
}