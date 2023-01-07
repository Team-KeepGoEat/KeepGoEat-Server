import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { mypageService } from "../service";

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
    const foundGoals = await mypageService.getGoalsForMypage(+userId, sort as string);
    return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE, { "goals": foundGoals, "goalCount": foundGoals.length }));
  } catch (error) {
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

const mypageController = {
  getMypageByUserId
}

export default mypageController;