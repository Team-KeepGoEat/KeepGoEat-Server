import e, { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService } from "../service";
import dayjs from "dayjs";
import { prisma } from "@prisma/client";
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

// 목표 추가
const createGoal = async (req: Request, res: Response) => {
  try {
    const { goalContent, isMore } = req.body;

    if (!goalContent || !isMore) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE)); // 데이터 비정상적 입력
    } 

    // dayjs 모듈에서 시간을 받아서 서버측에서 클라로 찍어주기
    const startedAt = dayjs().format();
    const data = await goalService.createGoal(goalContent, isMore, startedAt as string);

    return res.status(sc.OK).send(success(sc.OK, rm.CREATE_GOAL_SUCCESS, data));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
  }
}

// 목표 삭제
const deleteGoal = async (req: Request, res: Response) => {
  try {
    const { goalId } = req.params;
    if (!goalId) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
    await goalService.deleteGoal(+goalId);
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_GOAL_SUCCESS, { goalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
  }
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
  createGoal,
  deleteGoal,
  getHistoryByGoalId
};

export default goalController;