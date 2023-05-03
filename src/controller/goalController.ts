import { UpdateGoalDTO } from "../interfaces/goal/UpdateGoalDTO";
import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import slack from "../modules/slack";
import { dailyAchievedHistoryService, goalService } from "../service";
import date from "../modules/date"
import boxCounter from "../modules/boxCounter";
import { goalError } from "../error/customError";
import { validationResult } from "express-validator";
import logger from "../logger/logger";

const createGoal = async (req: Request, res: Response) => {
  const now = date.getNow();
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  const food = req.body.food;
  const criterion = req.body.criterion;
  const userId = req.user.userId;

  if (!userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const createGoalDTO: CreateGoalDTO = req.body; 
    const startedAt = date.getCurrentDatePlus9h(now);


    if(criterion === "" && typeof food === "string") {
      const data = await goalService.createFoodGoal(userId, createGoalDTO, startedAt);
      console.log(data);
      return res.status(sc.OK).send(success(sc.OK, rm.CREATE_GOAL_SUCCESS, data));
    }

    const data = await goalService.createGoal(userId, createGoalDTO, startedAt);

    if (data == goalError.MAX_GOAL_COUNT_ERROR) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.MAX_GOAL_COUNT_ERROR))
    }

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.CREATE_GOAL_SUCCESS, data));
  
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
}

const deleteGoal = async (req: Request, res: Response) => {
  try {
  
    const { goalId } = req.params;
    const deletedGoalId = await goalService.deleteGoal(+goalId);
    
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_GOAL_SUCCESS, { "goalId": deletedGoalId }));
  
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

const updateGoal = async (req: Request, res: Response) => {

  const food = req.body.food;
  const criterion = req.body.criterion;

  if (criterion === " ") {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const updateGoalDTO: UpdateGoalDTO = req.body;
  const { goalId } = req.params;

  try {

    // 기준만 수정 혹은 삭제되는 케이스
    if((food === null && criterion !== "" && typeof criterion === "string") 
        || (food === null && criterion === "")) {
      const updatedGoalId = await goalService.updateCriterion(+goalId, updateGoalDTO);
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.UPDATE_GOAL_SUCCESS, { "goalId": updatedGoalId }));
    }

    // 음식만 수정되는 케이스
    if(typeof food === "string" && food !== "" && criterion === null) { // criterion == ""
      const updatedGoalId = await goalService.updateFood(+goalId, updateGoalDTO);
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.UPDATE_GOAL_SUCCESS, { "goalId": updatedGoalId }));
    }

    // 음식, 기준 둘 다 수정하거나 음식을 수정하고 기준 삭제한 케이서
    const updatedGoalId = await goalService.updateGoal(+goalId, updateGoalDTO);
  
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.UPDATE_GOAL_SUCCESS, { "goalId": updatedGoalId }));
  
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

const keepGoal = async (req: Request, res: Response) => {
  const now = date.getNow();
  const { goalId } = req.params;
  const isOngoing = false;

  if (!goalId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const keptAt = date.getCurrentDatePlus9h(now);
    const keptGoalId = await goalService.keepGoal(+goalId, isOngoing, keptAt);
  
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.KEEP_GOAL_SUCCESS, { "goalId": keptGoalId }));
  
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

const getHistoryByGoalId = async (req: Request, res: Response) => {
  // middleware로 유저 검증하는 로직도 필요함
  const now = date.getNow();
  const { goalId } = req.params;
  if (!goalId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const foundGoal = await goalService.getGoalByGoalId(+goalId);

    if (!foundGoal) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(+goalId, date.getCurrentMonth(now));
    const lastMonthCount = await dailyAchievedHistoryService.getAchievedCount(+goalId, date.getLastMonth(now));

    const data = {
      "goalId": foundGoal.goalId,
      "isMore": foundGoal.isMore,
      "thisMonthCount": thisMonthCount,
      "lastMonthCount": lastMonthCount,
      "food": foundGoal.food, 
      "criterion": foundGoal.criterion === null ? "" : foundGoal.criterion, 
      "blankBoxCount": boxCounter.getBlankBoxCount(),
      "emptyBoxCount": boxCounter.getEmptyBoxCount(thisMonthCount)
    }

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_GOAL_SUCCESS_FOR_HISTORY, data));
  
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
}

const achieveGoal = async (req: Request, res: Response) => {
  const now = date.getNow();
  const nowPlus9h = date.getCurrentDatePlus9h(now);
  const userId = req.user.userId;
  const { goalId } = req.params;
  const { isAchieved } = req.body;

  if (!userId || isAchieved === null || isAchieved === undefined) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  let data;
  try {
    data = await goalService.achieveGoal(+goalId, isAchieved as boolean, now, nowPlus9h);

    if (data === goalError.DOUBLE_ACHIEVED_ERROR) {
      slack.sendErrorMessageToSlack(
          req.method.toUpperCase(), 
          req.originalUrl, 
          "[achievedError] Double Checked Error", 
          req.user?.userId);
      
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.ACHIEVE_GOAL_FAIL_FOR_DOUBLE_ACHIEVE));
    }
  
    if (data === goalError.DOUBLE_CANCELED_ERROR) {
      slack.sendErrorMessageToSlack(
          req.method.toUpperCase(), 
          req.originalUrl,  
          "[achievedError] Double Canceled Error", 
          req.user?.userId);
          
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.ACHIEVE_GOAL_FAIL_FOR_DOUBLE_CANCEL));
    }

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.ACHIEVE_GOAL_SUCCESS, data));

  } catch (error) {
    
    logger.errorLog(req.originalUrl, req.method, req.body, error, (error as any).stack);

    slack.sendErrorMessageToSlack(
      req.method.toUpperCase(), 
      req.originalUrl, 
      (error as any).stack, 
      req.user?.userId);
    
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
  }
};

const sortType = {
  ALL: "all",
  MORE: "more",
  LESS: "less"
};

const getKeptGoalsByUserId = async (req: Request, res: Response) => {  
  const now = date.getNow();
  const userId = req.user.userId;
  const sort = req.query.sort as string;

  if (!userId || !sort) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (sort !== sortType.ALL && sort !== sortType.MORE && sort !== sortType.LESS) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
  
    const foundGoals = await goalService.getKeptGoals(+userId, sort as string, now);
    
    return res
      .status(sc.OK)
      .send(success(sc.OK, 
        rm.GET_GOALS_SUCCESS_FOR_KEPTGOALS, 
        { "goals": foundGoals, "goalCount": foundGoals.length }));
  
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



const goalController = {
  createGoal,
  deleteGoal,
  updateGoal,
  getHistoryByGoalId,
  achieveGoal,
  keepGoal,
  getKeptGoalsByUserId
};

export default goalController;