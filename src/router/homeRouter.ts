import { Router } from "express";
import { homeController } from "../controller";

const router:Router = Router();

router.get("/", homeController.getHome);

export default router;