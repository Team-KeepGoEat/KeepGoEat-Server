import { Router } from "express";
import { goalController } from "../controller";

const router:Router = Router();

router.get("/:userId", goalController.getGoalsByUserId);

export default router;