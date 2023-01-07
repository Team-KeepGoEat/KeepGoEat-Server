import { Router } from "express";
import { authController } from "../controller";

const router:Router = Router();

router.post("/refresh", authController.refresh);
router.post("/", authController.auth);

export default router;