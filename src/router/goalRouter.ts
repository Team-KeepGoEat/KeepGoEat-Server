import { Router } from "express";
import { goalController } from "../controller";
import auth from "../middlewares/auth";

const router: Router = Router();

//* 목표 수정 - POST ~/goal/:goalId
router.post("/:goalId", auth, goalController.updateGoal);

//* 목표 삭제 - DELETE ~/goal/:goalId
router.delete("/:goalId", auth, goalController.deleteGoal);

//* 목표 추가 - POST ~/goal
router.post("/", auth, goalController.createGoal);

export default router;