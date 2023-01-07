import { Router } from "express";
import { mypageController } from "../controller";

const router:Router = Router();

router.get("/", mypageController.getMypageByUserId);

export default router;