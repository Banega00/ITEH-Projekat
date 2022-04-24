import { TransactionEntity } from "../../entities/transaction.entity";

export interface UserProfileData{
    username: string,
    email: string,
    name: string,
    balance: number,
    transactions: TransactionEntity[];
}