import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService, userService } from "../service";
import dayjs from "dayjs";
import { prisma } from "@prisma/client";
import { monthlyAchievedHistoryService } from "../service";
import date from "../modules/date"
import boxCounter from "../modules/boxCounter"

const sortType = {
  ALL: "all",
  MORE: "more",
  LESS: "less"
};

const getMypageByUserId = async (req:Request, res:Response) => {
  const userId = req.user.userId;

  console.log("user ", userId)
  const sort = req.query.sort as string;
  
  if (!userId || !sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (sort !== sortType.ALL && sort !== sortType.MORE && sort !== sortType.LESS) {
    console.log("sort ", sort);
    console.log("sortType.MORE ", sortType.MORE);
    console.log("more" !== sortType.MORE);
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  
  const foundGoals = await goalService.getGoalsForMypage(+userId, sort as string);

  return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE, { "goals": foundGoals, "goalCount": foundGoals.length }));

};
    
// 목표 추가
const createGoal = async (req: Request, res: Response) => {
  try {
    const { goalContent, isMore } = req.body;
    if (goalContent === null || isMore === null) {                                 // // isMore === false인 경우까지 BAD REQUEST 출력되지 않도록 처리                   
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
    const deletedGoalId = await goalService.deleteGoal(+goalId);
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_GOAL_SUCCESS, { "goalId": deletedGoalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
  }
};

// 목표 수정
const updateGoal = async(req: Request, res: Response) => {
  const { goalContent, isMore } = req.body;
  const { goalId } = req.params;

  const updatedGoalId = await goalService.updateGoal(+goalId, goalContent, isMore);
  return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_GOAL_SUCCESS, { "goalId": updatedGoalId }));
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
  getMypageByUserId,
  createGoal,
  deleteGoal,
  updateGoal,
  getHistoryByGoalId
};

export default goalController;