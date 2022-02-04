import { Router } from "express";
import { Controller } from "../api/controller";



export const router = Router()


router.get('/examplePath', Controller.exampleMiddleware);

