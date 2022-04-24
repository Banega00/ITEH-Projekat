import { json } from "body-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import { router } from "./router/router";
import { validateRequestPayload } from "./utils/validation/validator";
import { sendInvalidMethodResponse, sendResponse } from "./utils/wrappers/response-wrapper";
import session from 'express-session'
import { ErrorStatusCode, SuccessStatusCode } from "./utils/status-codes";
import MongoDbStore from 'connect-mongo';
import cors from "cors";
import { UserEntity } from "./entities/user.entity";
declare module 'express-session' {
  export interface SessionData {
    user: UserEntity;
  }
}

const app: Application = express();

app.use(json({limit: "50mb", type: "application/json"}));

//Middleware for validating requests payload
app.use(validateRequestPayload);

//cors middleware
app.use(cors({credentials: true, origin:true}))

// mongoose.connect('mongodb://localhost:27017/testiranje').then((data:any)=>console.log(data)).catch(error=>console.log(error))

//Express session middleware with MongoStore
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/e-betting-sessions',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    })
}))

//Set routers
app.use('/', router)
// app.use('/operation', routers.OperationsRouter);
// app.use('/internal', routers.InternalRouter);
// app.use('/report', routers.ReportsRouter);

app.use(sendInvalidMethodResponse);

export default app;