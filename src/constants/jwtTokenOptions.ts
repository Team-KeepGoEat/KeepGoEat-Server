export const accessTokenOption = {
  expiresIn: process.env.JWT_EXPIRE_TIME,
  issuer: process.env.JWT_ISSUER 
};

export const refreshTokenOption = {
  expiresIn: process.env.JWT_REFRESH_TIME,
  issuer: process.env.JWT_ISSUER
};