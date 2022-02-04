import { ExampleController } from './../api/example-controller';
import { Router } from "express";

const router = Router()
router.get('/examplePath', ExampleController.exampleMiddleware);


export const ExampleRouter = router;