import { Router } from "express";
import router from ".";
import { goalController } from "../controller";

router.get("/", goalController.getGoalsByUserId);

export default router;