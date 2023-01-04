import { Router } from "express";
import { goalController } from "../controller";
import auth from "../auth/authAPI";

const router: Router = Router();

//* 목표 추가 - POST ~/goal
router.post("/", auth, goalController.createGoal);

export default router;