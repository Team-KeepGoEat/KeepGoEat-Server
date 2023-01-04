import { Router } from "express";
import { goalController } from "../controller";

const router:Router = Router();

router.get("/:goalId", goalController.getHistoryByGoalId);

export default router;