import { Router } from "express";
import mypageRouter from "./mypageRouter";
import historyRouter from "./historyRouter";
import authRouter from "./authRouter";
import auth from "../middlewares/auth";

const router: Router = Router();

router.use("/mypage", mypageRouter);
router.use("/history", auth, historyRouter);
router.use("/auth", authRouter);

export default router;
