import jwt from "../modules/jwt";
import { Request, Response } from "express";
import { sc, rm } from "../constants";
import { fail, success } from "../constants/response";
import tokenType from "../constants/tokenType";

const refresh = (req: Request, res: Response) => {
  const { accessToken, refreshToken } = req.headers;

  if (!accessToken || !refreshToken) {
    return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));
  }

  try {
    const decodedAccess = jwt.verify(accessToken as string);
    
    // accessToken이 만료되지 않았을 때 - 400 에러
    if (decodedAccess !== tokenType.TOKEN_EXPIRED) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    if (decodedAccess === tokenType.TOKEN_EXPIRED) {

      const decodedRefresh = jwt.verify(refreshToken as string);

      // accessToken이 만료되었고 refreshToken도 만료되었을 때 - 400 에러
      if (decodedRefresh === tokenType.TOKEN_EXPIRED) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.EXPIRED_ALL_TOKEN));
      }

      // accessToken이 만료되었고 refreshToken은 만료되지 않았을 때 - 엑세스 토큰 재발급해서 엑세스 토큰만 보내줌

      const newRefreshToken = jwt.createRefreshToken();

      return res.status(sc.OK).send(success(sc.OK, rm.INVALID_TOKEN, newRefreshToken));
    }

  } catch (error) {

    console.log("토큰 재발급 에러 ", error);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

export default refresh;