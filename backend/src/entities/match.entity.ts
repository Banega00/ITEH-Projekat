import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne, CreateDateColumn, PrimaryColumn } from "typeorm";
import { MatchStatus } from "../models/match-status.enum";
import { SingleMatchResult } from "../models/responses/match-result.response";
import { TicketStatus } from "../models/ticket-status.enum";
import { TicketItemEntity } from "./ticket-item.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity()
export class MatchEntity{
    
    @PrimaryColumn()
    Id:number;

    @OneToMany(() => TicketItemEntity, (ticketItem) => ticketItem.match) // note: we will create author property in the Photo class below
    ticketItems: TicketItemEntity[]

    @Column()
    HomeCompetitorName: string

    @Column()
    AwayCompetitorName: string

    @Column()
    Code: number//ovo je code za rezultate - zove se sifra
    
    @Column()
    ExternalId: number
    
    @Column({nullable:true})
    StreamId: number

    @Column()
    StartDate: Date

    @Column({nullable:true})
    Status: number

    @Column({nullable:true})
    CompetitionId: number

    @Column({nullable:true})
    SportId: number
    
    // @Column({type:'enum', enum: MatchStatus, default: MatchStatus.Active})
    // matchStatus: MatchStatus

    @Column({type:'jsonb', nullable: true})
    matchResult: SingleMatchResult
    constructor(obj?:Partial<MatchEntity>) {
        if(!obj) return;
        obj.Id && (this.Id = obj.Id)
        obj.ticketItems && (this.ticketItems = obj.ticketItems)
        obj.HomeCompetitorName && (this.HomeCompetitorName = obj.HomeCompetitorName)
        obj.AwayCompetitorName && (this.AwayCompetitorName = obj.AwayCompetitorName)
        obj.Code && (this.Code = obj.Code)
        obj.ExternalId && (this.ExternalId = obj.ExternalId)
        obj.StreamId && (this.StreamId = obj.StreamId)
        obj.StartDate && (this.StartDate = obj.StartDate)
        obj.Status && (this.Status = obj.Status)
        obj.CompetitionId && (this.CompetitionId = obj.CompetitionId)
        obj.SportId && (this.SportId = obj.SportId)
        obj.matchResult && (this.matchResult = obj.matchResult)
        // obj.matchStatus && (this.matchStatus = obj.matchStatus)
        // obj.maximumWinning && (this.maximumWinning = obj.maximumWinning)
        // obj.ticketAmount && (this.ticketAmount = obj.ticketAmount)
        // obj.totalOdd && (this.totalOdd = obj.totalOdd)
        // obj.date && (this.date = obj.date)
        // obj.status && (this.status = obj.status)
    }
}