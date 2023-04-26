import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import { versioninfoService } from "../service";
import slack from "../modules/slack";
import logger from "../logger/logger";

const osType = {
  IOS: "iOS",
  AOS: "AOS"
}

const getVersionInfo = async(req: Request, res: Response) => {  
  
  const client = req.query.client as string;
  if(!client) {
    return res
    .status(sc.BAD_REQUEST)
    .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  if(client !== osType.IOS && client !== osType.AOS) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }

  try {
    const foundVersion = await versioninfoService.getVersionInfo(client as string);
    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.GET_VERSION_INFO_SUCCESS, { "version": foundVersion }));
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
};

const versioninfoController = {
  getVersionInfo,
}

export default versioninfoController;