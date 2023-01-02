import { Request, Response } from "express"
import { rm, sc } from "../constants"
import { fail, success } from "../constants/response";
import kakao from "../modules/kakao";
import { userService } from "../service";
import jwt from "../modules/jwt";

const auth = async(req: Request, res: Response) => {
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
        if (!platformUser) {
          console.log("kakaoAccount를 받아오는 과정에서 에러 발생")
        }
        break;
    }

    if (!platformUser) {
      return res.send(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_PLATFORM_USER));
    }

    const existingUser = await userService.getUserByPlatformId(platformUser.email, platform);

    // 이미 가입한 유저일 경우
    // 과정이 너무 비슷하니 빼도 메소드로 빼도 ㄱㅊ을지도
    if (existingUser) {
      const { refreshToken } = jwt.createRefreshToken();
      const { accessToken } = jwt.signup(+existingUser.userId, existingUser.email);
      const signinResult = {
        type: "login",
        email: existingUser.email, // 유저 테이블에 email 추가
        accessToken: accessToken,
        refreshToken: refreshToken
      }
      return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, signinResult))
    }

    const newUser = await userService.createUser(platformUser.email, platform);
    const { refreshToken } = jwt.createRefreshToken();
    const { accessToken } = jwt.signup(newUser.userId, newUser.email);
    
    const signupResult = {
      type: "login",
      email: newUser.email, // 유저 테이블에 email 추가
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, signupResult));

  } catch (error) {
    console.log("소셜 로그인 및 회원가입 에러 ", error);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

export default auth;