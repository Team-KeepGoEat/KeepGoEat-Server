import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService, cheeringMessageService } from "../service";
import date from "../modules/date";
import time from "../modules/time";
import slack from "../modules/slack";
import logger from "../logger/logger";

const getHome = async (req: Request, res: Response) => {
  const now = date.getNow();
  const userId = req.user.userId;
  if (!userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {

    const goals = await goalService.getHomeGoalsByUserId(date.getCurrentMonth(now), +userId, now);
    let isGoalExisted;
    goals.length === 0 ? isGoalExisted = false : isGoalExisted = true;
    const cheeringMessage = await cheeringMessageService.getRamdomMessage(isGoalExisted);
    const currentDayTime = await time.getDayTime();

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_GOALS_SUCCCESS_FOR_HOME, {
        "goals": goals,
        "goalCount": goals.length,
        "cheeringMessage": cheeringMessage,
        "daytime": currentDayTime
      }));

  } catch (error) {
    
    logger.errorLog(req.originalUrl, req.method, req.body, error, (error as any).stack);

    slack.sendErrorMessageToSlack(
      req.method.toUpperCase(), 
      req.originalUrl, 
      (error as any).stack, 
      req.user?.userId);
    
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const homeController = {
  getHome,
}

export default homeController;