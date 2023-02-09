import { Router } from "express";
import authController from "../controller/authController"

const router:Router = Router();

router.get("/refresh", authController.refresh);
router.post("/", authController.socialLogin);

export default router;