import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import bcrypt from 'bcrypt'
import { TransactionEntity } from "./transaction.entity";
@Entity()
export class UserEntity{
    
    

    @PrimaryGeneratedColumn()
    id:number;

    @Column('varchar', {unique:true})
    username: string;

    @Column('varchar')
    password: string;

    @Column('varchar')
    name: string;

    @Column('varchar')
    email: string;

    @Column({default:0})
    balance: number;

    @OneToMany(() => TransactionEntity, transaction => transaction.user)
    transactions: TransactionEntity[];

    constructor(obj?:Partial<UserEntity>) {
        if(!obj) return;
        this.username = obj.username ?? '';
        this.password = obj.password ?? '';
        this.email = obj.email ?? '';
        this.name = obj.name ?? '';
        this.balance = obj.balance ?? 0;
        this.transactions = obj.transactions ?? [];
    }

    async hashPassword() {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
    }

    public calculateBalance(value: number) {
        if(this.balance + value >= 0 ) this.balance+=value;
        else throw new Error("Not enough money");
    }
}