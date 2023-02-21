import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { mypageService } from "../service";
import slack from "../modules/slack";
import { debugLog, errorLog } from "../logger/logger";

const getAccountInfoByUserId = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if(!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const accountInfo = await mypageService.getAccountInfoForMyPage(+userId);
    const keptGoalsCount = await mypageService.getKeptGoalsCountForMyPage(+userId);
    const data = {
      "name": accountInfo?.name,
      "email": accountInfo?.email,
      "keptGoalsCount": keptGoalsCount
    }
    if (accountInfo?.name === null || accountInfo?.name === undefined) {
      data.name = "유저 실명을 받아오지 못했습니다."
    }
    return res.status(sc.OK).send(success(sc.OK, rm.GET_ACCOUNT_INFO_SUCCESS_FOR_MYPAGE, data));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
}

const sortType = {
  ALL: "all",
  MORE: "more",
  LESS: "less"
};

const getKeptGoalsByUserId = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const sort = req.query.sort as string;

  if (!userId || !sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (sort !== sortType.ALL && sort !== sortType.MORE && sort !== sortType.LESS) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
  
    const foundGoals = await mypageService.getKeptGoalsForMypage(+userId, sort as string);
    
    debugLog(req.originalUrl, req.method, req.body, req.user?.userId);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE, { "goals": foundGoals, "goalCount": foundGoals.length }));
  
  } catch (error) {
    
    slack.sendErrorMessageToSlack(req.method.toUpperCase(), req.originalUrl, error, req.user?.userId);
    errorLog(req.originalUrl, req.method, req.body, error, req.user?.userId);

    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

const mypageController = {
  getAccountInfoByUserId,
  getKeptGoalsByUserId
}

export default mypageController;