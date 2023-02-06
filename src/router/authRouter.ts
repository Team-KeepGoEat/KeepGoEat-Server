import { Router } from "express";
import auth from "../auth/auth";

const router:Router = Router();

router.get("/refresh", auth.refresh);
router.post("/", auth.socialLogin);

export default router;