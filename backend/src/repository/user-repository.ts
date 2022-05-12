import { EntityManager, Repository } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { UserEntity } from "../entities/user.entity";
import { TransactionPurpose } from "../models/transaction-purpose.enum";
import { UserRole } from "../models/user-role.enum";
import dataSource from "./db-connection";

export class UserRepository{
    userRepository: Repository<UserEntity>;
    constructor() {
        this.userRepository = dataSource.getRepository<UserEntity>(UserEntity)        
    }

    async getUser(criteria:any, entityManager?:EntityManager){
        if(entityManager) return await entityManager.findOne(UserEntity, {where:criteria});
        return await this.userRepository.findOne({where:criteria})
    }
    
    async getUserById(id:number, entityManager?:EntityManager){
        if(entityManager) return await entityManager.findOne(UserEntity, {where:{id}, relations:['tickets', 'tickets.items','transactions']});
        return await this.userRepository.findOne({where:{id}, relations:['tickets', 'tickets.items','transactions']})
        // return await connectionTool.find(UserEntity, {where:criteria});
    }

    async getUsers(entityManager?:EntityManager){
        if(entityManager) return await entityManager.find(UserEntity, {where:{role: UserRole.USER}});
        return await this.userRepository.find({where:{role: UserRole.USER}});
    }

    async getUserCount(entityManager?:EntityManager){
        const manager = entityManager ?? this.userRepository.manager;
        return await manager.count(UserEntity, {where:{role: UserRole.USER}})
    }

    async addUser(user: UserEntity, entityManager?:EntityManager){
        if(entityManager) return entityManager.save(UserEntity, user);
        return await this.userRepository.save<UserEntity>(user);
    }
    
    async getUserProfileData(id:number, entityManager?:EntityManager){
        const manager = entityManager ?? this.userRepository.manager 
        return await manager.findOne(UserEntity,{where:{id}, relations:['transactions','tickets', 'tickets.items', 'tickets.items.match'], order: {transactions: { date: "DESC"}, tickets: {date: "DESC"}}})
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

    async saveUser(user:UserEntity, entityManager?:EntityManager){
        const manager = entityManager ? entityManager : this.userRepository.manager;
        return await manager.save(user)
    }
}