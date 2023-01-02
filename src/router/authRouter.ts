import { Router } from "express";
import auth from "../auth/auth";

const router:Router = Router();

router.post("/", auth);

export default router;