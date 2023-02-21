import { Router } from "express";
import { mypageController } from "../controller";

const router:Router = Router();

router.get("/", mypageController.getKeptGoalsByUserId);
router.get("/account", mypageController.getAccountInfoByUserId);

export default router;