import axios from "axios";
import qs from "qs";
import { Request, Response } from "express"
import { rm, sc } from "../constants"
import { fail, success } from "../constants/response";
import sns from "../modules/sns";
import { userService } from "../service";
import jwtHandler from "../modules/jwtHandler";
import tokenType from "../constants/tokenType";
import { User } from "@prisma/client";
import slack from "../modules/slack";

const socialLogin = async (req: Request, res: Response) => {
  const { platformAccessToken, platform } = req.body;

  if (!platformAccessToken || !platform) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    let platformUser;
    switch (platform) {
      case "KAKAO":
        platformUser = await sns.kakao(platformAccessToken as string);
        break;

      case "APPLE":
        platformUser = await sns.apple(platformAccessToken as string);
        break;

      case "NAVER":
        platformUser = await sns.naver(platformAccessToken as string);
        break;
    }

    if (platformUser === tokenType.INVALID_PLATFORM_USER) {
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_PLATFORM_USER));
    }

    if (!platformUser) {
      console.log("########## socialAccount를 받아오지 못함 ##########")
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_PLATFORM_USER));
    }

    const existingUser = await userService.getUserByEmail(platformUser.email, platform);

    if (existingUser) {
      const { refreshToken } = jwtHandler.createRefreshToken();
      await userService.updateUserByUserId(existingUser.userId, refreshToken);
      const { accessToken } = jwtHandler.signup(+existingUser.userId, existingUser.email);
      const signinResult = {
        type: "signin",
        email: existingUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken
      }
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.SIGNIN_SUCCESS, signinResult))
    }

    const { refreshToken } = jwtHandler.createRefreshToken();
    const newUser = await userService.createUser(platformUser.email, platformUser.name, platform, refreshToken);
    const { accessToken } = jwtHandler.signup(newUser.userId, newUser.email);

    const signupResult = {
      type: "signup",
      email: newUser.email,
      accessToken: accessToken,
      refreshToken: refreshToken
    };

    return res
      .status(sc.CREATED)
      .send(success(sc.CREATED, rm.SIGNUP_SUCCESS, signupResult));

  } catch (error: any) {
    console.log("소셜 로그인 및 회원가입 에러 ", error);
    slack
      .sendErrorMessageToSlack(
        req.method.toUpperCase(), 
        req.originalUrl, 
        error, 
        req.user?.userId);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

const refresh = async (req: Request, res: Response) => {
  const accessToken = req.headers.accesstoken;
  const refreshToken = req.headers.refreshtoken;

  if (!accessToken || !refreshToken) {
    return res
      .status(sc.UNAUTHORIZED)
      .send(fail(sc.UNAUTHORIZED, rm.NULL_VALUE));
  }

  try {
    const decodedAccess = jwtHandler.verify(accessToken as string);

    // accessToken이 만료되지 않았을 때 - 400 에러
    if (decodedAccess !== tokenType.TOKEN_EXPIRED) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    // accessToken이 유효하지 않았을 때 - 401 에러
    if (decodedAccess === tokenType.TOKEN_INVALID) {
      console.log("accessToken이 유효하지 않았을 때");
      return res
        .status(sc.UNAUTHORIZED)
        .send(fail(sc.UNAUTHORIZED, rm.INVALID_ACCESS_TOKEN));
    }

    if (decodedAccess === tokenType.TOKEN_EXPIRED) {
      const decodedRefresh = jwtHandler.verify(refreshToken as string);

      // accessToken이 만료되었고 refreshToken는 유효하지 않았을 때 - 401 에러
      if (decodedRefresh === tokenType.TOKEN_INVALID) {
        console.log("accessToken이 만료되었고 refreshToken는 유효하지 않았을 때");
        return res
          .status(sc.UNAUTHORIZED)
          .send(fail(sc.UNAUTHORIZED, rm.INVALID_REFRESH_TOKEN));
      }

      // accessToken이 만료되었고 refreshToken도 만료되었을 때 - 401 에러
      if (decodedRefresh === tokenType.TOKEN_EXPIRED) {
        console.log("accessToken이 만료되었고 refreshToken도 만료되었을 때");
        return res
          .status(sc.UNAUTHORIZED)
          .send(fail(sc.UNAUTHORIZED, rm.EXPIRED_ALL_TOKEN));
      }

      const user = await userService.getUserByRefreshToken(refreshToken as string);

      // rf로 찾은 유저가 없을 때 - 400 에러 
      if (!user) {
        return res
          .status(sc.BAD_REQUEST)
          .send(fail(sc.BAD_REQUEST, rm.NOT_EXISITING_USER));
      }

      const { accessToken } = jwtHandler.signup((user as User).userId, (user as User).email);

      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.CREATE_TOKEN_SUCCESS, { accessToken, refreshToken }));
    }

  } catch (error) {

    console.log("토큰 재발급 에러 ", error);
    slack
      .sendErrorMessageToSlack(
        req.method.toUpperCase(), 
        req.originalUrl, 
        error, 
        req.user?.userId);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

const withdrawUser = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const code = req.query.code as string;

  if (!userId) {
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
  }
  
  try {
    const deletedUser = await userService.deleteUserById(userId);

    if (!deletedUser) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.NOT_EXISITING_USER));
    }

    // code를 안받은 네이버, 카카오 로그인인 경우
    if (!code) {
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.WITHDRAWAL_SUCCESS));
    }

    const client_secret = jwtHandler.createAppleJWT();
    const refresh_token = await jwtHandler.getAppleRefresh(code);

    const data = {
      token: refresh_token,
      client_id: process.env.APPLE_CLIENTID,
      client_secret: client_secret,
      token_type_hint: "refresh_token"
    }

    await axios
      .post("https://appleid.apple.com/auth/revoke", qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(async (res) => {
        console.log(res.data);
        await userService.deleteUserById(userId);
      })
      .catch((error) => {
        console.log(error);
        throw 400;
      });

    return res
      .status(sc.OK)
      .send(success(sc.OK, rm.WITHDRAWAL_SUCCESS));

  } catch (error) {
    if (error === 400) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
}

const authController = {
  socialLogin,
  refresh,
  withdrawUser
}

export default authController;