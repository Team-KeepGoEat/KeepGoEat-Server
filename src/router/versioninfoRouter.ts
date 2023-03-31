import { Router } from "express";
import { versioninfoController } from "../controller";

const router: Router = Router();

router.get("/", versioninfoController.getVersionInfo);

export default router;