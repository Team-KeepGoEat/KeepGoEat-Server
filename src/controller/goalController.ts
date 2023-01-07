import { UpdateGoalDTO } from "../interfaces/goal/UpdateGoalDTO";
import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import dayjs from "dayjs";
import { dailyAchievedHistoryService, goalService } from "../service";
import date from "../modules/date"
import boxCounter from "../modules/boxCounter";
import achievedError from "../constants/achievedError";
import { validationResult } from "express-validator";

const createGoal = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }
  const userId = req.user.userId;

  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const createGoalDTO: CreateGoalDTO = req.body; 
    const startedAt = date.getNowPlus9()

    const data = await goalService.createGoal(userId, createGoalDTO, startedAt);

    return res.status(sc.OK).send(success(sc.OK, rm.CREATE_GOAL_SUCCESS, data));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); 
  }
}

const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    const deletedGoalId = await goalService.deleteGoal(+goalId);
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_GOAL_SUCCESS, { "goalId": deletedGoalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); 
  }
};

const updateGoal = async (req: Request, res: Response) => {

  const error = validationResult(req);
  if(!error.isEmpty()) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const updateGoalDTO: UpdateGoalDTO = req.body;
  const { goalId } = req.params;

  try {

    const updatedGoalId = await goalService.updateGoal(+goalId, updateGoalDTO);
    return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_GOAL_SUCCESS, { "goalId": updatedGoalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); 
  }

};

const keepGoal = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const isOngoing = false;

  if (!goalId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const keptAt = date.getNowPlus9()
    const keptGoalId = await goalService.keepGoal(+goalId, isOngoing, keptAt);
    return res.status(sc.OK).send(success(sc.OK, rm.KEEP_GOAL_SUCCESS, { "goalId": keptGoalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); 
  }

};

const getHistoryByGoalId = async (req: Request, res: Response) => {
  // middleware로 유저 검증하는 로직도 필요함
  const { goalId } = req.params;
  if (!goalId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const foundGoal = await goalService.getGoalByGoalId(+goalId);

    if (!foundGoal) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(+goalId, date.getCurrentMonthMinus9());
    const lastMonthCount = await dailyAchievedHistoryService.getAchievedCount(+goalId, date.getLastMonthMinus9());

    const data = {
      "goalId": foundGoal.goalId,
      "isMore": foundGoal.isMore,
      "thisMonthCount": thisMonthCount,
      "lastMonthCount": lastMonthCount,
      "goalContent": foundGoal.goalContent,
      "blankBoxCount": boxCounter.getBlankBoxCount(),
      "emptyBoxCount": boxCounter.getEmptyBoxCount(thisMonthCount)
    }

    return res.status(sc.OK).send(success(sc.OK, rm.GET_GOAL_SUCCESS_FOR_HISTORY, data));
  
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
}

const achieveGoal = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const { goalId } = req.params;
  const { isAchieved } = req.body;

  console.log("isAchieved ", isAchieved);
  if (!userId || isAchieved === null || isAchieved === undefined) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  let data;
  try {

    data = await goalService.achieveGoal(+goalId, isAchieved as boolean);
    console.log("Data ", data);

  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
  }

  if (data === achievedError.DOUBLE_ACHIEVED_ERROR) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ACHIEVE_GOAL_FAIL_FOR_DOUBLE_ACHIEVE));
  }

  if (data === achievedError.DOUBLE_CANCELED_ERROR) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.ACHIEVE_GOAL_FAIL_FOR_DOUBLE_CANCEL));
  }

  return res.status(sc.CREATED).send(success(sc.CREATED, rm.ACHIEVE_GOAL_SUCCESS, data));

};

const goalController = {
  createGoal,
  deleteGoal,
  updateGoal,
  getHistoryByGoalId,
  achieveGoal,
  keepGoal
};

export default goalController;