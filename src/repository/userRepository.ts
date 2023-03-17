import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const findUserByEmail = async (email: string, platform: string) => {
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

const findUserByUserId = async (userId: number) => {
  const foundUser = await prisma.user.findUnique({
    where: {
      userId
    }
  });

  return foundUser;
};

const createUser = async (email: string, name: string | null | undefined, platform: string, refreshToken: string) => {
  const newUser = await prisma.user.create({
    data: {
      email: email,        
      platformType: platform,
      refreshToken: refreshToken,
      name: name
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

const deleteUserById = async (userId: number) => {

  const foundUser = await findUserByUserId(userId);

  if (!foundUser) {
    return null
  }

  const deletedUser = await prisma.user.delete({
    where: {
      userId: userId
    }
  });

  return deletedUser;

}

const userRepository = {
  findUserByEmail,
  createUser,
  findUserByUserId,
  findUserByRefreshToken,
  updateUserByUserId,
  deleteUserById
};

export default userRepository;