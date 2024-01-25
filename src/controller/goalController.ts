import { Request, Response } from "express";
import { AchieveGoalResponseDTO, GetGoalHistoryResponseDTO, GetKeptGoalsResponseDTO } from "../DTO/response";
import { AchieveGoalRequestDTO, CreateGoalRequestDTO, UpdateGoalRequestDTO } from "../DTO/request";
import { sc, rm, sortType } from "../constants";
import { fail, success } from "../DTO/common/response";
import { slack, date, logger } from "../modules";
import { goalService } from "../service";
import { goalError } from "../error/customError";
import { validationResult } from "express-validator";

const createGoal = async (req: Request, res: Response) => {
  const now = date.getNow();
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  const criterion: string = req.body.criterion;
  const userId: number = req.user.userId;

  if (!userId || criterion === " ") {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const createGoalDTO: CreateGoalRequestDTO = req.body; 
    const startedAt: string = date.getCurrentDatePlus9h(now);

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
    const deletedGoalId: number = await goalService.deleteGoal(+goalId);
    
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
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  const criterion: string = req.body.criterion;

  if (criterion === null) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const updateGoalDTO: UpdateGoalRequestDTO = req.body;
  const { goalId } = req.params;

  try {
    // 음식, 기준 둘 다 수정하거나 음식을 수정하고 기준 삭제한 케이스
    const updatedGoalId: number = await goalService.updateGoal(+goalId, updateGoalDTO);
  
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
  const now: string = date.getNow();
  const { goalId } = req.params;
  const isOngoing: boolean = false;

  if (!goalId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const keptAt: string = date.getCurrentDatePlus9h(now);
    const keptGoalId: number = await goalService.keepGoal(+goalId, isOngoing, keptAt);
  
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
  const now: string = date.getNow();
  const { goalId } = req.params;
  if (!goalId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const data: GetGoalHistoryResponseDTO | null = await goalService.getGoalByGoalId(+goalId, now);

    if (!data) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
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
  const now: string = date.getNow();
  const nowPlus9h: string = date.getCurrentDatePlus9h(now);
  const userId: number = req.user.userId;
  const { goalId }  = req.params;
  let acheieveGoalRequestDTO: AchieveGoalRequestDTO = req.body;
  let isAchieved: boolean = acheieveGoalRequestDTO.isAchieved;

  if (!userId || isAchieved === null || isAchieved === undefined) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const data: AchieveGoalResponseDTO | number = await goalService.achieveGoal(+goalId, isAchieved, now, nowPlus9h);

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

const getKeptGoalsByUserId = async (req: Request, res: Response) => {  
  const now: string = date.getNow();
  const userId: number = req.user.userId;
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
  
    const data: GetKeptGoalsResponseDTO = await goalService.getKeptGoals(+userId, sort as string, now);
    
    return res
      .status(sc.OK)
      .send(success(sc.OK, 
        rm.GET_GOALS_SUCCESS_FOR_KEPTGOALS, 
        data));
  
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