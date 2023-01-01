export const accessTokenOption = {
  algorithm: process.env.JWT_ALGO,
  expiresIn: process.env.JWT_EXPIRE_TIME,
  issuer: process.env.JWT_ISSUER
};

export const refreshTokenOption = {
  algorithm: process.env.JWT_ALGO,
  expiresIn: process.env.JWT_REFRESH_TIME,
  issuer: process.env.JWT_ISSUER
};