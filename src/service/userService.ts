import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getUserByPlatformId = async(userPlatformId: string, platform: string) => {
  const foundUser = await prisma.user.findFirst({
    where: {
      platform_type: platform,
      email: userPlatformId
    }
  });

  return foundUser;
};

const createUser = async() => {

}

const userService = {
  getUserByPlatformId,
  createUser
};

export default userService;