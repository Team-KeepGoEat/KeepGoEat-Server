import { Router } from "express";
import mypageRouter from "./mypageRouter";

const router: Router = Router();

router.use("/mypage", mypageRouter)

export default router;
