import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService } from "../service";
import dayjs from "dayjs";
import { prisma } from "@prisma/client";



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
  const { goalContent, isMore } = req.body;

  // dayjs 모듈에서 시간을 받아서 서버측에서 클라로 찍어주기
  const createdAt = dayjs() as unknown;
  const data = await goalService.createGoal(goalContent, isMore, createdAt as string);

  if (!data) {
		return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
	} 
	return res.status(sc.OK).send(success(sc.OK, rm.CREATE_GOAL_SUCCESS, data));
}

const goalController = {
  getGoalsByUserId,
  createGoal,
};

export default goalController;