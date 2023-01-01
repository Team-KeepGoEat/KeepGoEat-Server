import { Router } from "express";
import mypageRouter from "./mypageRouter";
import historyRouter from "./historyRouter";

const router: Router = Router();

router.use("/mypage", mypageRouter);
router.use("/history", historyRouter);


export default router;
