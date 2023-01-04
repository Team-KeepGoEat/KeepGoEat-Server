import jwt from "jsonwebtoken";
import { accessTokenOption, refreshTokenOption} from "../constants/jwtTokenOptions";
import tokenType from "../constants/tokenType";

const secretKey = process.env.JWT_SECRET as string;

const signup = (userId: number, email:string) => {
  const payload = {
    id: userId,
    email: email
  };

  const result = {
    accessToken: jwt.sign(payload, secretKey, accessTokenOption)
  };

  return result
}

const createRefreshToken = () => {
  const result = {
    refreshToken: jwt.sign({}, secretKey, refreshTokenOption)
  };

  return result; 
}

const verify = (accessToken: string) => {

  let decodedToken: string | jwt.JwtPayload;

  try {
    decodedToken = jwt.verify(accessToken, secretKey);
  } catch (error: any) {
    if (error.message === "jwt expired") {
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === "invalid token") {
      return tokenType.TOKEN_INVALID;
    } else {
      return tokenType.TOKEN_INVALID;
    }
  }

  return decodedToken;
};

const jwtUtils = {
  createRefreshToken,
  signup,
  verify
}

export default jwtUtils;