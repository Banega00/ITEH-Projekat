//API folder contains controllers which handles requests

import { Request, Response, NextFunction } from "express";
import { SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";

export class ExampleController{

    public static async exampleMiddleware(request: Request, response:Response, next:NextFunction): Promise<any>{
        //handle response
        sendResponse(response, 200, SuccessStatusCode.Success);
    }
}