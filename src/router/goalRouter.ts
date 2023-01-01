import { Router } from "express";
import { goalController } from "../controller";

const router: Router = Router();

//* 목표 추가 - POST ~/goal
router.get("/", goalController.createGoal);

export default router;