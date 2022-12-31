import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService } from "../service";


const getGoalsByUserId = async (req:Request, res:Response) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const data = goalService.getGoalsByUserId(userId);

  return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE));

};

const goalController = {
  getGoalsByUserId
};

export default goalController;