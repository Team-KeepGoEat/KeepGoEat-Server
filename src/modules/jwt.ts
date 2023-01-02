import jwt from "jsonwebtoken";
import { accessTokenOption, refreshTokenOption} from "../constants/jwtTokenOptions";

const secretOrPrivateKey = process.env.JWT_SECRET as string;

const signup = (userId: number, email:string) => {
  const payload = {
    id: userId,
    email: email
  };

  const result = {
    accessToken: jwt.sign(payload, secretOrPrivateKey, accessTokenOption)
  };

  return result
}


const createRefreshToken = () => {

  const result = {
    refreshToken: jwt.sign({}, secretOrPrivateKey, refreshTokenOption)
  };

  return result; 
}

const jwtUtils = {
  createRefreshToken,
  signup,
}

export default jwtUtils;