import { json } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import { router } from "./router/router";
import { validateRequestPayload } from "./utils/validation/validator";
import { sendInvalidMethodResponse, sendResponse } from "./utils/wrappers/response-wrapper";
import session from 'express-session'
import { ErrorStatusCode, SuccessStatusCode } from "./utils/status-codes";
import MongoDbStore from 'connect-mongo';
declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const app: Application = express();

app.use(json({limit: "50mb", type: "application/json"}));

//Middleware for validating requests payload
app.use(validateRequestPayload);

// mongoose.connect('mongodb://localhost:27017/testiranje').then((data:any)=>console.log(data)).catch(error=>console.log(error))

//Express session middleware with MongoStore
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/testiranje',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    })
}))




app.get('/login', (request: Request, response: Response) =>{
    //check user credentials (username, password) - TODO
    request.session.user = request.body.user; //initialize session
    return sendResponse(response, 200, SuccessStatusCode.Success)
})

app.get('/test', authMiddleware, (request: Request, response: Response) =>{
    console.log("Korisnik " + request.session.user!.ime + " je poslao zahtev")
    return sendResponse(response, 200, SuccessStatusCode.Success)
})

app.get('/logout', (request: Request, response: Response) =>{
    request.session.destroy(()=>undefined);
    return sendResponse(response, 200, SuccessStatusCode.Success)
})

function authMiddleware(request: Request, response: Response, next: NextFunction){
    if(isAuthenticated(request)) return next();
    return sendResponse(response, 401, ErrorStatusCode.Unauthorized)
}

function isAuthenticated(request: Request){
    return request.session.user != undefined
}

//Set routers
app.use('/', router)
// app.use('/operation', routers.OperationsRouter);
// app.use('/internal', routers.InternalRouter);
// app.use('/report', routers.ReportsRouter);

app.use(sendInvalidMethodResponse);

export default app;