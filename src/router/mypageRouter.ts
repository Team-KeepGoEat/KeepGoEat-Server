import { Router } from "express";
import { goalController } from "../controller";

const router:Router = Router();

router.get("/", goalController.getMypageByUserId);

export default router;