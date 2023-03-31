import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { mypageService } from "../service";

const getAccountInfoByUserId = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if(!userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const accountInfo = await mypageService.getAccountInfoForMyPage(+userId);
    const keptGoalsCount = await mypageService.getKeptGoalsCountForMyPage(+userId);
    const data = {
      "name": accountInfo?.name,
      "email": accountInfo?.email,
      "keptGoalsCount": keptGoalsCount
    }
    if (accountInfo?.name === null || accountInfo?.name === undefined) {
      data.name = "유저 실명을 받아오지 못했습니다."
    }
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ACCOUNT_INFO_SUCCESS_FOR_MYPAGE, data));
  } catch (error) {
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
}

const mypageController = {
  getAccountInfoByUserId,
}

export default mypageController;