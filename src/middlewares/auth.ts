import { fail } from "./../constants/response";
import { Request, Response, NextFunction } from "express"
import { sc, rm } from "../constants";
import jwt from "../modules/jwtHandler";
import tokenType from "../constants/tokenType";
import { JwtPayload } from "jsonwebtoken";
import { userService } from "../service";
import slack from "../modules/slack";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.accesstoken;
  const refreshToken = req.headers.refreshtoken;

  if (!accessToken || !refreshToken) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    const decodedToken = jwt.verify(accessToken as string);
    if (decodedToken === tokenType.TOKEN_EXPIRED) {
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
    }
    if (decodedToken === tokenType.TOKEN_INVALID) {
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_ACCESS_TOKEN));
    }

    const userId = (decodedToken as JwtPayload).id;
    if (!userId) {
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_ACCESS_TOKEN));
    }

    const foundUser = await userService.getUserByUserId(userId);

    if (!foundUser) {
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.NOT_EXISITING_USER));
    }

    req.user = foundUser;
    next();
    
  } catch(error) {
    slack.sendErrorMessageToSlack(req.method.toUpperCase(), req.originalUrl, error, req.user?.userId);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

export default auth;