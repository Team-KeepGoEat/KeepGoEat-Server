import { Router } from "express";
import { goalController } from "../controller";

const router:Router = Router();

router.get("/", goalController.getHome);

export default router;