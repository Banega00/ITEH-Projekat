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

    @Column({name:'totalOdd', nullable: false, type: 'numeric' })
    public _totalOdd: number;
    public get totalOdd(): number {
        return (+this._totalOdd);
    }
    public set totalOdd(value: number) {
        this._totalOdd = value;
    }

    @Column({name:'ticketAmount', nullable: false, type: 'numeric' })
    public _ticketAmount: number;
    public get ticketAmount(): number {
        return (+this._ticketAmount);
    }
    public set ticketAmount(value: number) {
        this._ticketAmount = value;
    }

    @Column({name:'maximumWinning', nullable: false, type: 'numeric' })
    public _maximumWinning: number;
    public get maximumWinning(): number {
        return (+this._maximumWinning);
    }
    public set maximumWinning(value: number) {
        this._maximumWinning = value;
    }

    @Column({type: 'enum', enum: TicketStatus, nullable: false, default: TicketStatus.Active})
    status: TicketStatus;

    @OneToOne(() => TransactionEntity)
    @JoinColumn()
    transaction: TransactionEntity

    @OneToMany(() => TicketItemEntity, (item) => item.ticket)
    items: TicketItemEntity[]

    @ManyToOne(() => UserEntity, (user) => user.tickets)
    user: UserEntity;


    @Column()
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