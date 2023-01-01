import { Request, Response } from "express"
import { rm, sc } from "../constants"
import { fail, success } from "../constants/response";
import kakao from "../modules/kakao";
import { userService } from "../service";
import jwt from "../modules/jwt";

const auth = async(req: Request, res: Response) => {
  const { accessToken, platform } = req.body;

  if ( !accessToken || !platform ) {
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  }

  try {
    // accessToken으로 카카오에서 유저 정보 받아옴
    let user;
    switch (platform) {
      case "KAKAO": 
        user = await kakao(accessToken as string);
        if (!user) {
          console.log("kakaoAccount를 받아오는 과정에서 에러 발생")
        }
        break;
    }

    if (!user) {
      res.send(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.UNAUTHORIZED_PLATFORM_USER));
    }

    const existingUser = await userService.getUserByPlatformId(user.email, platform);

    // 이미 가입한 유정일 경우
    // 과정이 너무 비슷하니 빼도 메소드로 빼도 ㄱㅊ을지도
    if (existingUser) {
      const { refreshToken } = jwt.createRefreshToken();
      const { accessToken } = jwt.signup(+existingUser.id, existingUser.email);
      const signinResult = {
        type: "login",
        email: existingUser.email, // 유저 테이블에 email 추가
        accessToken: accessToken,
        refreshToken: refreshToken
      }
      return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, signinResult))
    }

    const newUser = await userService.createUser();
    const { refreshToken } = jwt.createRefreshToken();
    const { accessToken } = jwt.signup(existingUser);
    
    const signupResult = {
      type: "login",
        email: newUser.email, // 유저 테이블에 email 추가
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    
    return res.status(sc.CREATED).send(success(sc.CREATED, rm.SIGNUP_SUCCESS, signupResult));

  } catch (error) {
    console.log("소셜 로그인 및 회원가입 에러 ", error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }

};

export default auth;