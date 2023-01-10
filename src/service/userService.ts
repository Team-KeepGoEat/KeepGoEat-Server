import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getUserByEmail = async (email: string, platform: string) => {
  const foundUser = await prisma.user.findFirst({
    where: {
      platformType: platform,
      email: email
    }
  });

  return foundUser;
};

const updateUserByUserId = async (userId: number, refreshToken: string) => {
  const foundUser = await prisma.user.update({
    where: {
      userId: userId
    },
    data: {
      refreshToken: refreshToken
    }
  });

  return foundUser;
}

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

const getUserByRefreshToken = async (refreshToken: string) => {
  const foundUser = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken
    }
  });

  return foundUser;
}

const userService = {
  getUserByEmail,
  createUser,
  getUserByUserId,
  getUserByRefreshToken,
  updateUserByUserId
};

export default userService;