import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { goalService } from "../service";


const getGoalsByUserId = async (req:Request, res:Response) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  const foundGoals = await goalService.getGoalsByUserId(+userId);

  return res.status(sc.OK).send(success(sc.OK, rm.GET_GOALS_SUCCESS_FOR_MYPAGE, foundGoals));

};

// 목표 추가
// const createGoal = async (req: Request, res: Response) => {
//   const { goalContent } = req.body;

//   const data = await GoalService.createGoal(goalContent);


// }

const goalController = {
  getGoalsByUserId,
  // createGoal,
};

export default goalController;