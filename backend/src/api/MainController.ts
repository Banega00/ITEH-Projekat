import { MasterDataModel } from '../models/soccer-bet/master-data.model';
import { ErrorStatusCode } from '../utils/status-codes';
import { Request, Response, NextFunction } from "express";
import { Httper } from "../utils/httper";
import { SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";

export class MainController{
    private httper:Httper;

    constructor() { 
        this.httper = new Httper("https://soccerbet.rs/api");
    }

    public healt = async (request: Request, response:Response, next:NextFunction): Promise<any> =>{
        sendResponse(response, 200, SuccessStatusCode.Success, {message: "Server is alive", time: `Current time is: ${new Date().toDateString()}`})
    }

    public getMasterData = async (request: Request, response:Response, next:NextFunction): Promise<any> =>{
        try{
            const responseData = await this.httper.get('/MasterData/GetMasterData');
            const masterData:MasterDataModel = responseData.data;
            return sendResponse(response, 200, SuccessStatusCode.Success, masterData);
        }catch(error){
            console.log(error)
            return sendResponse(response, 400, ErrorStatusCode.UnknownError, null);
        }
    }
}