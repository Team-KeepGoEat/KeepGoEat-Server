import { PrismaClient } from "@prisma/client";
import date from "../modules/date";

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

const findKeptGoalsForMypage = async (userId: number, sort: string) => {
  let goals;
  let isMore;

  if (sort !== "all") {
    sort === "more" ? isMore = true : isMore = false;
    goals = await prisma.goal.findMany({
      where: {        
        writerId: userId,
        isOngoing: false,
        isMore: isMore
      },
      orderBy: {
        startedAt: "desc"
      },
    });

    return goals.map((goal) => {
      return {
        goalId: goal.goalId,
        food: goal.food,
        criterion: goal.criterion === null ? "" : goal.criterion,
        isMore: goal.isMore,
        isOngoing: goal.isOngoing,
        totalCount: goal.totalCount,
        startedAt: date.formatDate(goal.startedAt),
        keptAt: goal.keptAt === null ? "" : date.formatDate(goal.keptAt),
        isAchieved: goal.isAchieved,
        writerId: goal.writerId
      }
    });
  }

  goals = await prisma.goal.findMany({
    where: {
      writerId: userId,
      isOngoing: false
    },
    orderBy: {
      startedAt: "desc"
    },
  });

  return goals.map((goal) => {
    return {
      goalId: goal.goalId,
      food: goal.food,
      criterion: goal.criterion === null ? "" : goal.criterion,
      isMore: goal.isMore,
      isOngoing: goal.isOngoing,
      totalCount: goal.totalCount,
      startedAt: date.formatDate(goal.startedAt),
      keptAt: goal.keptAt === null ? "" : date.formatDate(goal.keptAt),
      isAchieved: goal.isAchieved,
      writerId: goal.writerId
    }
  });
};

const mypageRepository = {
  findAccountInfoForMyPage,
  findKeptGoalsCountForMyPage,
  findKeptGoalsForMypage,
};

export default mypageRepository;