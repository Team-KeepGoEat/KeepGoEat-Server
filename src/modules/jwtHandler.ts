import { refreshTokenOption } from "./../constants/jwtTokenOptions";
import jwt from "jsonwebtoken";
import { accessTokenOption } from "../constants/jwtTokenOptions";
import tokenType from "../constants/tokenType";
import axios from "axios";
import qs from "qs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const secretKey = process.env.JWT_SECRET as string;

const signup = (userId: number, email:string) => {
  const payload = {
    id: userId,
    email: email
  };

  const accessToken = {
    accessToken: jwt.sign(payload, secretKey, accessTokenOption)
  };

  return accessToken
}

const createRefreshToken = () => {
  const refreshToken = {
    refreshToken: jwt.sign({}, secretKey, refreshTokenOption)
  };

  return refreshToken; 
}

const verify = (accessToken: string) => {

  let decodedToken: string | jwt.JwtPayload;

  try {
    decodedToken = jwt.verify(accessToken, secretKey);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      console.log("만료된 토큰")
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      console.log("유효하지 않은 토큰 토큰");
      return tokenType.TOKEN_INVALID;
    } else {
      return tokenType.TOKEN_INVALID;
    }
  }

  return decodedToken;
};

const createAppleJWT = () => {
  const privateKey = (process.env.APPLE_PRIVATE_KEY as string).replace(/\\n/g, "\n");
  const token = jwt.sign(
    {
      iss: process.env.APPLE_TEAMID,
      iat: dayjs().tz().unix(),
      exp: dayjs().tz().unix() + 120,
      aud: "https://appleid.apple.com",
      sub: process.env.APPLE_CLIENTID,
    },
    privateKey,
    {
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: process.env.APPLE_KEYID,
      },
    },
  )
  
  return token;
}

const getAppleRefresh = async (code: string) => {
  const client_secret = createAppleJWT();

  try {
    let refreshToken: string | null = null;

    const data = {
      code: code, 
      client_id: process.env.APPLE_CLIENTID,
      client_secret: client_secret,
      grant_type: "authorization_code",
    };

    await axios
      .post("https://appleid.apple.com/auth/token", qs.stringify(data), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then(async (res) => {
        refreshToken = res.data.refresh_token;
      });
    return refreshToken;

  } catch (error) {
    console.log(error);
  }


}

const jwtHandler = {
  createRefreshToken,
  signup,
  verify,
  createAppleJWT,
  getAppleRefresh
}

export default jwtHandler;