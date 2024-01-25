import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../DTO/common/response";
import { goalService } from "../service";
import { date, slack, logger } from "../modules";
import { GetHomeGoalsResponseDTO } from "../DTO/response";

const getHome = async (req: Request, res: Response) => {
  const now: string = date.getNow();
  const userId: number = req.user.userId;
  if (!userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {

    const data: GetHomeGoalsResponseDTO = await goalService.getHomeGoalsByUserId(date.getCurrentMonth(now), +userId, now);

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_GOALS_SUCCCESS_FOR_HOME, data));

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