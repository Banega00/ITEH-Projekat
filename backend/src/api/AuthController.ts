import { NextFunction, Request, Response } from "express";
import { getManager } from "typeorm";
import { UserRepository } from "../repository/user-repository";
import { Helpers } from "../utils/helpers";
import { ErrorStatusCode, SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";
import * as RequestModels from '../models/requests/index'
import { UserEntity } from "../entities/user.entity";
import { updapteUserTickets } from "../utils/update-ticket";
import { UserRole } from "../models/user-role.enum";
import { UserAccountStatus } from "../models/user-account-status.enums";

export class AuthController{
    

    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    
    login = async (request: Request<{},{},{username:string, password:string}>, response: Response)=>{
        const {username, password} = request.body;

        try{
            const user = await this.userRepository.getUser({username})
            if(!user) return sendResponse(response, 400, ErrorStatusCode.InvalidUsername)

            if(await Helpers.comparePassword(password, user.password)){
                if(user.accountStatus == UserAccountStatus.BLOCKED) return sendResponse(response, 400, ErrorStatusCode.AccountBlocked)
                request.session.user = user;

                await updapteUserTickets(user.id);
                return sendResponse(response, 200, SuccessStatusCode.SuccessfulLogin)
            }else{
                return sendResponse(response, 400, ErrorStatusCode.InvalidPassword)
            }
        }catch(error){ 
            console.error(error);
            return sendResponse(response, 500, ErrorStatusCode.UnknownError)
        }
    }

    register = async (request: Request<{},{},RequestModels.Register>, response: Response)=>{
        const {username} = request.body;
        
        try{
            const user = await this.userRepository.getUser({username})
            
            if(user) return sendResponse(response, 400, ErrorStatusCode.UserAlreadyExists, {message: `UserEntity with username ${username} alreayd exists`})

            const userToAdd = new UserEntity(request.body)
            await userToAdd.hashPassword();
            const savedUser = await this.userRepository.addUser(userToAdd)
            request.session.user = savedUser;
            return sendResponse(response, 201, SuccessStatusCode.SuccessfulRegistraion )
        }catch(error){ 
            console.error(error);
            return sendResponse(response, 500, ErrorStatusCode.UnknownError)
        }
    }

    logout = async (request: Request, response: Response) =>{
        request.session.destroy(()=>undefined);
        return sendResponse(response, 200, SuccessStatusCode.Success)
    }

    authMiddleware = async (request: Request<{},{},RequestModels.Register>, response: Response, next: NextFunction)=>{
        if(this.isAuthenticated(request)) return next();
        return sendResponse(response, 401, ErrorStatusCode.Unauthorized)
    }

    adminAuthMiddleware = async (request: Request<{},{},RequestModels.Register>, response: Response, next: NextFunction)=>{
        if(this.isAuthenticated(request) && this.isAdmin(request)) return next();
        return sendResponse(response, 401, ErrorStatusCode.Unauthorized)
    }

    getUserData = async (request: Request, response: Response, next: NextFunction)=>{
        const user = request.session.user;
        if(user) user.password = ''
        return sendResponse(response, 200, SuccessStatusCode.Success, user)
    }

    private isAuthenticated(request: Request){
        return request.session.user != undefined
    }

    private isAdmin(request: Request){
        return request.session.user?.role == UserRole.ADMIN
    }
}