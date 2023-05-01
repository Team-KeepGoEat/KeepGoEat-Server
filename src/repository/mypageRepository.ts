import { Goal, PrismaClient } from "@prisma/client";
import date from "../modules/date";
import { goalService } from "../service";

const prisma = new PrismaClient();

const findAccountInfoForMyPage = async(userId: number) => {
  const accountInfo = await prisma.user.findUnique({
    where: {
      userId: userId
    }
  });

  return accountInfo;
};

const findKeptGoalsCountForMyPage = async(userId: number) => {

  const keptGoalsCount = await prisma.goal.count({
    where: {
      writerId: userId,
      isOngoing: false
    }    
  });

  return keptGoalsCount;
}

const mypageRepository = {
  findAccountInfoForMyPage,
  findKeptGoalsCountForMyPage,
};

export default mypageRepository;