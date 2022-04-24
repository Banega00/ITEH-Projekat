import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionPurpose } from "../models/transaction-purpose.enum";
import { UserEntity } from "./user.entity";

@Entity()
export class TransactionEntity{
    

    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable: false})
    value: number;

    @Column({type: 'enum', enum: TransactionPurpose, nullable: false})
    transactionPurpose: TransactionPurpose;

    @ManyToOne(() => UserEntity, user => user.transactions)
    user: UserEntity;

    @CreateDateColumn()
    date: Date;

    userId: number;

    constructor(obj?:Partial<TransactionEntity>) {
        if(!obj) return;
        obj.value && (this.value = obj.value)
        obj.transactionPurpose && (this.transactionPurpose = obj.transactionPurpose)
        obj.user && (this.user = obj.user)
    }
}