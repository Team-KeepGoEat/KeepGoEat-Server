const jwt = require("jsonwebtoken");
import { accessTokenOption, refreshTokenOption} from "../constants/jwtTokenOptions";

const secretKey = process.env.JWT_ALGO

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

const jwtUtils = {
  createRefreshToken,
  signup,
}

export default jwtUtils;