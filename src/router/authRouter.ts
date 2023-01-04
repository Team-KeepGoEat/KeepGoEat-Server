import { Router } from "express";
import auth from "../auth/authAPI";

const router:Router = Router();

router.post("/refresh", auth);
router.post("/", auth);

export default router;