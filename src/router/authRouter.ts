import { Router } from "express";
import { authController } from "../controller";
import auth from "../middlewares/auth";

const router:Router = Router();

router.get("/refresh", authController.refresh);
router.get("/withdraw", auth, authController.withdrawUser);
router.post("/", authController.socialLogin);

export default router;