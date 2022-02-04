import { ErrorStatusCode } from './../status-codes';
import { assert } from "joi";
import { sendResponse } from "../wrappers/response-wrapper";
import { Schemes } from "./validation-schemes";
import { Request, Response, NextFunction} from 'express';

//Purpose of this function is to validate payload of http request against defined schema
export async function validateRequestPayload(request: Request, response: Response, next: NextFunction) {

    try {

        const body = request.body;

        //key will be route
        const key = request.url as keyof typeof Schemes;

        //if scheme for route exists - payload will be validated
        //otherwise next middleware will be called
        if(Schemes[key])assert(body, Schemes[key], {abortEarly: true, allowUnknown: false});

        next();

    } catch (error) {
        console.log("Invalid request payload: ", error)
        sendResponse(response, 400, ErrorStatusCode.ValidationError, {message: error.details[0].message});
    }

}