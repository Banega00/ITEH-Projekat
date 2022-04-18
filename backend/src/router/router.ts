import { Router } from "express";
import { MainController } from "../api/MainController";

const mainController = new MainController();

export const router = Router()

router.get('/healt', mainController.healt);

router.get('/get-master-data', mainController.getMasterData);

router.get('/get-competition-filter', mainController.getCompetitionFilter)

router.get('/get-matches/:competitionId', mainController.getMatches)
