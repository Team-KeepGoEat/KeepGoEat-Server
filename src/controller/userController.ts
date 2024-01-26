import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../DTO/common/response";
import { userService } from "../service";
import { slack, logger } from "../modules";
import { GetUserInfoResponseDTO } from "../DTO/response";

const getUserInfoByUserId = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  if(!userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {

    const data: GetUserInfoResponseDTO = await userService.getAccountInfo(+userId);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_ACCOUNT_INFO_SUCCESS_FOR_MYPAGE, data));
  
  } catch (error) {
    
    logger.errorLog(req.originalUrl, req.method, req.body, error, (error as any).stack);

    slack.sendErrorMessageToSlack(
      req.method.toUpperCase(), 
      req.originalUrl, 
      (error as any).stack, 
      req.user?.userId);

    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
}

const mypageController = {
  getUserInfoByUserId,
}

export default mypageController;