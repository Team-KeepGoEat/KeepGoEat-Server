import { Router } from "express";
import { goalController } from "../controller";

const router:Router = Router();

router.post("/", goalController.getHome);

export default router;