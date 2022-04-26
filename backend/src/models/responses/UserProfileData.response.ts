import { TicketEntity } from "../../entities/ticket.entity";
import { TransactionEntity } from "../../entities/transaction.entity";

export interface UserProfileData{
    username: string,
    email: string,
    name: string,
    _balance: number,
    transactions: TransactionEntity[]
    tickets: TicketEntity[];
}