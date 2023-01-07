import { Router } from "express";
import { goalController } from "../controller";
import auth from "../middlewares/auth";
const { body } = require('express-validator');

const router: Router = Router();

//* 목표 보관 - POST ~/goal/keep/:goalId 
router.post(
  "/keep/:goalId", 
  [
    body("goalContent").trim().notEmpty(),
  ],
  auth, 
  goalController.keepGoal
);

router.post("/achieve/:goalId", auth, goalController.achieveGoal);

//* 목표 수정 - POST ~/goal/:goalId
router.post("/:goalId", auth, goalController.updateGoal);

//* 목표 삭제 - DELETE ~/goal/:goalId
router.delete("/:goalId", auth, goalController.deleteGoal);

//* 목표 추가 - POST ~/goal
router.post(
  "/", 
  [
    body("goalContent").trim().notEmpty(), // 공백 문자열도 NULL VALUE 에러 걸리도록
    body("isMore").notEmpty(),
  ], 
  auth, 
  goalController.createGoal
);

export default router;