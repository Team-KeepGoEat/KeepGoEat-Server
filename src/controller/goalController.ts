import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService, cheeringMessageService } from "../service";
import dayjs from "dayjs";
import { monthlyAchievedHistoryService } from "../service";
import date from "../modules/date"
import boxCounter from "../modules/boxCounter";
import achievedError from "../constants/achievedError";

const sortType = {
  ALL: "all",
  MORE: "more",
  LESS: "less"
};

const getMypageByUserId = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const sort = req.query.sort as string;

  if (!userId || !sort) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if (sort !== sortType.ALL && sort !== sortType.MORE && sort !== sortType.LESS) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const foundGoals = await goalService.getGoalsForMypage(+userId, sort as string);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE, { "goals": foundGoals, "goalCount": foundGoals.length }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

// 목표 추가
const createGoal = async (req: Request, res: Response) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const { goalContent, isMore } = req.body; // createGoal DTO 는 request header나 parameter에는 안쓴다~~ response body request body에 쓴다. api별로 createGoalDTO 이런식으로!

    if (!goalContent || goalContent === " " || isMore === null || isMore === undefined) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE)); // 데이터 비정상적 입력
    }

    // dayjs 모듈에서 시간을 받아서 서버측에서 클라로 찍어주기
    const startedAt = dayjs().format();
    const data = await goalService.createGoal(userId, goalContent, isMore, startedAt as string);

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
const updateGoal = async (req: Request, res: Response) => {
  const { goalContent } = req.body;
  const { goalId } = req.params;

  try {
    const updatedGoalId = await goalService.updateGoal(+goalId, goalContent);
    if (!goalContent || goalContent === " ") {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_GOAL_SUCCESS, { "goalId": updatedGoalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
  }

};

// 목표 보관
const keepGoal = async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const isOngoing = false;
  const keptAt = dayjs().format();

  if (!goalId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const keptGoalId = await goalService.keepGoal(+goalId, isOngoing, keptAt);
    console.log(keptAt);
    return res.status(sc.OK).send(success(sc.OK, rm.KEEP_GOAL_SUCCESS, { "goalId": keptGoalId }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR)); // 서버 내부 에러
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

    const thisMonthCount = await monthlyAchievedHistoryService.getMonthlyHistoryCount(date.getCurrentMonth(), +goalId);
    const lastMonthCount = await monthlyAchievedHistoryService.getMonthlyHistoryCount(date.getLastMonth(), +goalId);

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

const getHome = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const result = await goalService.getHomeGoalsByUserId(date.getCurrentMonth(), +userId);
    const cheeringMessage = await cheeringMessageService.getRamdomMessage();

    return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCCESS_FOR_HOME, {
      "goals": result,
      "goalCount": result.length,
      "cheeringMessage": cheeringMessage.cheeringMessage
    }));

  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

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
  getMypageByUserId,
  createGoal,
  deleteGoal,
  updateGoal,
  getHistoryByGoalId,
  getHome,
  achieveGoal,
  keepGoal
};

export default goalController;