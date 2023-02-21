import { Router } from "express";
import { mypageController } from "../controller";

const router:Router = Router();

router.get("/", mypageController.getAccountInfoByUserId);
router.get("/keptGoals", mypageController.getKeptGoalsByUserId);


export default router;