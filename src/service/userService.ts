import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getUserByPlatformId = async (userPlatformId: string, platform: string) => {
  const foundUser = await prisma.user.findFirst({
    where: {
      platformType: platform,
      email: userPlatformId
    }
  });

  return foundUser;
};

const getUserByUserId = async (userId: number) => {
  const foundUser = await prisma.user.findUnique({
    where: {
      userId
    }
  });

  return foundUser;
};

const createUser = async (email: string, platform: string, refreshToken: string) => {
  const newUser = await prisma.user.create({
    data: {
      email: email,        
      platformType: platform,
      refreshToken: refreshToken
     }
  });

  return newUser;
}

const findUserByRefreshToken = async (refreshToken: string) => {
  const foundUser = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken
    }
  });

  return foundUser;
}

const userService = {
  getUserByPlatformId,
  createUser,
  getUserByUserId,
  findUserByRefreshToken
};

export default userService;