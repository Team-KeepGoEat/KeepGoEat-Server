import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService } from "../service";
import { monthlyAchievedHistoryService } from "../service";
import date from "../modules/date"
import boxCounter from "../modules/boxCounter"

const getGoalsByUserId = async (req:Request, res:Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const foundGoals = await goalService.getGoalsByUserId(+userId);

  return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE, foundGoals));

};

const getHistoryByGoalId = async(req:Request, res:Response) => {
  // middleware로 유저 검증하는 로직도 필요함
  const { goalId } = req.params;
  if (!goalId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const foundGoal = await goalService.getGoalByGoalId(+goalId);

  if (!foundGoal) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  const thisMonthCount = await monthlyAchievedHistoryService.getMonthlyHistory(date.getCurrentMonth());
  const lastMonthCount = await monthlyAchievedHistoryService.getMonthlyHistory(date.getLastMonth());
  
  const data = {
    "writerId": foundGoal.writerId,
    "goalId": foundGoal.goalId,
    "isMore": foundGoal.isMore,
    "thisMonthCount": thisMonthCount,
    "lastMonthCount": lastMonthCount,
    "goalContent": foundGoal.goalContent,
    "blankBoxCount": boxCounter.getBlankBoxCount(),
    "emptyBoxCount": boxCounter.getEmptyBoxCount(thisMonthCount)
  }

  return res.status(sc.OK).send(success(sc.OK, rm.GET_GOAL_SUCCESS_FOR_HISTORY, data));
}

const goalController = {
  getGoalsByUserId,
  getHistoryByGoalId
};

export default goalController;