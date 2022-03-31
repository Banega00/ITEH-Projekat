import { Router } from "express";
import { MainController } from "../api/MainController";

const mainController = new MainController();

export const router = Router()

router.get('/healt', mainController.healt);

router.get('/get-master-data', mainController.getMasterData);
