import { EntityManager, Repository } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { UserEntity } from "../entities/user.entity";
import { TransactionPurpose } from "../models/transaction-purpose.enum";
import { dataSource } from "./db-connection";

export class UserRepository{

    userRepository: Repository<UserEntity>;
    constructor() {
        this.userRepository = dataSource.getRepository<UserEntity>(UserEntity)        
    }

    async getUser(criteria:any, entityManager?:EntityManager){
        if(entityManager) return await entityManager.findOne(UserEntity, {where:criteria});
        return await this.userRepository.findOne({where:criteria})
        // return await connectionTool.find(UserEntity, {where:criteria});
    }

    async addUser(user: UserEntity, entityManager?:EntityManager){
        if(entityManager) return entityManager.save(UserEntity, user);
        return await this.userRepository.save<UserEntity>(user);
    }
    
    async getUserProfileData(id:number, entityManager?:EntityManager){
        const manager = entityManager ?? this.userRepository.manager 
        return await manager.findOne(UserEntity,{where:{id}, relations:['transactions'], order: {transactions: { date: "DESC"}}})
    }

    async makeTransaction(userId: number, value: number, transactionPurpose: TransactionPurpose, entityManager?:EntityManager){
        const manager = entityManager ?? this.userRepository.manager;
        const user = await manager.findOne(UserEntity, {where: {id:userId}});
        if(!user) throw new Error("USER NOT FOUND");

        const transaction = new TransactionEntity({user, value, transactionPurpose});

        user.calculateBalance(value);

        manager.save(user);
        manager.save(transaction);
    }
}