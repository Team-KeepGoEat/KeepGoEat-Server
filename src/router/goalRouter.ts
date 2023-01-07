import { Router } from "express";
import { goalController } from "../controller";
import auth from "../middlewares/auth";
import { DateMiddleware } from "../middlewares/date";

const router: Router = Router();

//* 목표 보관 - POST ~/goal/keep/:goalId 
router.post("/keep/:goalId", goalController.keepGoal);

router.post("/achieve/:goalId", goalController.achieveGoal);

//* 목표 수정 - POST ~/goal/:goalId
router.post("/:goalId", goalController.updateGoal);

//* 목표 삭제 - DELETE ~/goal/:goalId
router.delete("/:goalId", auth, goalController.deleteGoal);

//* 목표 추가 - POST ~/goal
router.post("/", goalController.createGoal);

export default router;