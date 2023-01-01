import {} from "jwt";

const signup = (userId: number, email:string) => {
  const payload = {
    id: userId,
    email: email
  };

  const result = {
    accessToken: jwt.sign(payload)
  };

  return result
}


const createRefreshToken = () => {
  const result = {
    refreshToken: jwt.sign();
  };

  return result; 
}

const jwt = {
  createRefreshToken,
  signup,
}

export default jwt;