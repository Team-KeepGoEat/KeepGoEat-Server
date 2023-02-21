import { PrismaClient } from "@prisma/client";
import date from "../modules/date";

const prisma = new PrismaClient();

const getAccountInfoForMyPage = async(userId: number) => {
  const accountInfo = await prisma.user.findUnique({
    where: {
      userId: userId
    }
  });

  return accountInfo;
};

const getKeptGoalsCountForMyPage = async(userId: number) => {
  let keptGoalsCount = 0;

  const keptGoals = await prisma.goal.findMany({
    where: {
      writerId: userId,
    }    
  });
  keptGoals.map((goal) => {
    if (goal.keptAt !== null) { 
      ++keptGoalsCount; 
    }
  });
  return keptGoalsCount;
}

const getKeptGoalsForMypage = async (userId: number, sort: string) => {
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
        startedAt: date.dateFormatter(goal.startedAt),
        keptAt: goal.keptAt === null ? "" : date.dateFormatter(goal.keptAt),
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
      startedAt: date.dateFormatter(goal.startedAt),
      keptAt: goal.keptAt === null ? "" : date.dateFormatter(goal.keptAt),
      isAchieved: goal.isAchieved,
      writerId: goal.writerId
    }
  });
};

const mypageService = {
  getAccountInfoForMyPage,
  getKeptGoalsCountForMyPage,
  getKeptGoalsForMypage,
};

export default mypageService