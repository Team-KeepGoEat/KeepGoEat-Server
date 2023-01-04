import { Router } from "express";
import { goalController } from "../controller";

const router:Router = Router();

router.get("/:userId", goalController.getMypageByUserId);

export default router;