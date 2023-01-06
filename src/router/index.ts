import { Router } from "express";
import mypageRouter from "./mypageRouter";
import goalRouter from "./goalRouter";
import historyRouter from "./historyRouter";
import authRouter from "./authRouter";
import homeRouter from "./homeRouter";
import auth from "../middlewares/auth";

const router: Router = Router();

router.use("/mypage", auth, mypageRouter);
router.use("/goal", auth, goalRouter);
router.use("/history", auth, historyRouter);
router.use("/auth", authRouter);
router.use("/home", auth, homeRouter);


export default router;
