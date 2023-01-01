import { Router } from "express";
import mypageRouter from "./mypageRouter";
import goalRouter from "./goalRouter";

const router: Router = Router();

router.use("/mypage", mypageRouter);
router.use("/goal", goalRouter);

export default router;
