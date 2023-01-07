import { PrismaClient } from "@prisma/client";
import date from "../modules/date";

const prisma = new PrismaClient();

const getGoalsForMypage = async (userId: number, sort: string) => {
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
        goalContent: goal.goalContent,
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
      goalContent: goal.goalContent,
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
  getGoalsForMypage,
};

export default mypageService