import { Request, Response, Router } from "express";
import { AdminController } from "../api/AdminController";
import { AuthController } from "../api/AuthController";
import { MainController } from "../api/MainController";
import { SuccessStatusCode } from "../utils/status-codes";
import { sendResponse } from "../utils/wrappers/response-wrapper";

const mainController = new MainController();
const authController = new AuthController();
const adminController = new AdminController();

export const router = Router()


//Admin routes
router.get('/users', authController.adminAuthMiddleware, adminController.getUsers)
router.get('/stats', authController.adminAuthMiddleware, adminController.getStats)

//Auth routes
router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/logout', authController.logout)
router.get('/checkAuth', authController.authMiddleware, (request: Request, response: Response) => sendResponse(response, 200, SuccessStatusCode.Success))
router.get('/userData', authController.authMiddleware, authController.getUserData)


//Main routes
router.get('/healt', mainController.healt);

router.get('/get-master-data', mainController.getMasterData);

router.get('/get-competition-filter', mainController.getCompetitionFilter)

router.get('/get-matches/:competitionId', mainController.getMatches)

router.get('/user-profile-data', authController.authMiddleware, mainController.getUserProfileData);

router.post('/make-transaction', authController.authMiddleware, mainController.makeTransaction);

router.post('/submit-ticket', authController.authMiddleware, mainController.submitTicket);

router.get('/update-user-tickets', authController.authMiddleware, mainController.updateUserTicketsMiddleware)

