import { Router } from "express";
import { goalController } from "../controller";
const { body } = require("express-validator");

const router: Router = Router();

router.post(
  "/keep/:goalId", 
  goalController.keepGoal
);

router.post("/achieve/:goalId", goalController.achieveGoal);

router.post(
  "/:goalId", 
  [
    body("food").trim().notEmpty(), 
    body("criterion").trim().notEmpty(),
  ],
  goalController.updateGoal
);

router.delete("/:goalId", goalController.deleteGoal);

router.post(
  "/", 
  [
    body("food").trim().notEmpty(), 
    body("criterion").trim().notEmpty(),
    body("isMore").notEmpty(),
  ], 
  goalController.createGoal
);

router.get("/kept", goalController.getKeptGoalsByUserId);

export default router;