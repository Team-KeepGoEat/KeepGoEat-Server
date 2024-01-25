const accessTokenOption = {
  expiresIn: process.env.JWT_EXPIRE_TIME,
  issuer: process.env.JWT_ISSUER 
};

const refreshTokenOption = {
  expiresIn: process.env.JWT_REFRESH_TIME,
  issuer: process.env.JWT_ISSUER
};

const jwtTokenOptions = {
  accessTokenOption, 
  refreshTokenOption
};

export default jwtTokenOptions;