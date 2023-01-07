import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService, cheeringMessageService } from "../service";
import date from "../modules/date"
import time from "../modules/time";

const getHome = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    // const result = await goalService.getHomeGoalsByUserId(date.getCurrentMonth(), +userId);
    const cheeringMessage = await cheeringMessageService.getRamdomMessage();
    const currentDayTime = await time.getDayTime();

    return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCCESS_FOR_HOME, {
      "goals": result,
      "goalCount": result.length,
      "cheeringMessage": cheeringMessage,
      "daytime": currentDayTime
    }));

  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const homeController = {
  getHome,
}

export default homeController;