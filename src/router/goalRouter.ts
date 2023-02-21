import { Router } from "express";
import { goalController } from "../controller";
import auth from "../middlewares/auth";
const { body } = require("express-validator");

const router: Router = Router();

router.post(
  "/keep/:goalId", 
  auth, 
  goalController.keepGoal
);

router.post("/achieve/:goalId", goalController.achieveGoal);

router.post(
  "/:goalId", 
  [
    body("food").trim().notEmpty(), 
    body("criterion").trim().notEmpty(),
  ],
  auth, 
  goalController.updateGoal
);

router.delete("/:goalId", auth, goalController.deleteGoal);

router.post(
  "/", 
  [
    body("food").trim().notEmpty(), 
    body("criterion").trim().notEmpty(),
    body("isMore").notEmpty(),
  ], 
  auth, 
  goalController.createGoal
);

export default router;