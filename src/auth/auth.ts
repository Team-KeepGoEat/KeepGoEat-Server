import { Request, Response } from "express"
import { rm, sc } from "../constants"
import { fail, success } from "../constants/response";
import kakao from "../modules/kakao";
import { userService } from "../service";
import jwt from "../modules/jwt";
import platformToken from "../constants/platformToken";
import tokenType from "../constants/tokenType";
import { User } from "@prisma/client";
import slack from "../modules/slack";

const socialLogin = async (req: Request, res: Response) => {
  const { platformAccessToken, platform } = req.body;

  if ( !platformAccessToken || !platform ) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    // accessToken으로 카카오에서 유저 정보 받아옴
    let platformUser;
    switch (platform) { 
      case "KAKAO": 
        platformUser = await kakao(platformAccessToken as string);
        
        if (platformUser === platformToken.INVALID_PLATFORM_USER) {
          return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_PLATFORM_USER));
        }
        break;
    }

    if (!platformUser) {
      console.log("########## socialAccount를 받아오지 못함 ##########")
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_PLATFORM_USER));
    }

    const existingUser = await userService.getUserByEmail(platformUser.email, platform);

    if (existingUser) {
      const { refreshToken } = jwt.createRefreshToken();
      await userService.updateUserByUserId(existingUser.userId, refreshToken);
      const { accessToken } = jwt.signup(+existingUser.userId, existingUser.email);
      const signinResult = {
        type: "signin",
        email: existingUser.email, 
        accessToken: accessToken,
        refreshToken: refreshToken
      }
      return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, signinResult))
    }

    const { refreshToken } = jwt.createRefreshToken();
    const newUser = await userService.createUser(platformUser.email, platform, refreshToken);
    const { accessToken } = jwt.signup(newUser.userId, newUser.email);
    
    const signupResult = {
      type: "signup",
      email: newUser.email, 
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, signupResult));

  } catch (error) {
    console.log("소셜 로그인 및 회원가입 에러 ", error);
    slack.sendErrorMessageToSlack(req.method.toUpperCase(), req.originalUrl, error, req.user?.userId);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

const refresh = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken;
  const refreshToken = req.headers.refreshtoken;

  if (!accessToken || !refreshToken) {
    return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.NULL_VALUE));
  }

  try {
    const decodedAccess = jwt.verify(accessToken as string);
    
    // accessToken이 만료되지 않았을 때 - 400 에러
    if (decodedAccess !== tokenType.TOKEN_EXPIRED) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    // accessToken이 유효하지 않았을 때 - 401 에러
    if (decodedAccess === tokenType.TOKEN_INVALID) {
      console.log("accessToken이 유효하지 않았을 때");
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_ACCESS_TOKEN));
    }
    
    if (decodedAccess === tokenType.TOKEN_EXPIRED) {
      const decodedRefresh = jwt.verify(refreshToken as string);

      // accessToken이 만료되었고 refreshToken는 유효하지 않았을 때 - 401 에러
      if (decodedRefresh === tokenType.TOKEN_INVALID) {
        console.log("accessToken이 만료되었고 refreshToken는 유효하지 않았을 때");
        return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_REFRESH_TOKEN));
      }

      // accessToken이 만료되었고 refreshToken도 만료되었을 때 - 401 에러
      if (decodedRefresh === tokenType.TOKEN_EXPIRED) {
        console.log("accessToken이 만료되었고 refreshToken도 만료되었을 때");
        return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_ALL_TOKEN));
      }

      const user = await userService.getUserByRefreshToken(refreshToken as string);

      // rf로 찾은 유저가 없을 때 - 400 에러 
      if (!user) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NOT_EXISITING_USER));
      }

      const { accessToken } = jwt.signup((user as User).userId, (user as User).email);
      
      return res.status(sc.OK).send(success(sc.OK, rm.CREATE_TOKEN_SUCCESS, { accessToken, refreshToken }));
    }

  } catch (error) {

    console.log("토큰 재발급 에러 ", error);
    slack.sendErrorMessageToSlack(req.method.toUpperCase(), req.originalUrl, error, req.user?.userId);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

const auth = {
  socialLogin,
  refresh
}

export default auth;