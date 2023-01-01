import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getGoalsByUserId = async (userId: number) => {
  const allGoals = await prisma.goal.findMany({
    where: {
      writer_id: userId
    }
  });

  return allGoals;
};

const getGoalByUserId = async (goalId: number) => {
  const goal = await prisma.goal.findUnique({
    where: {
      goal_id: goalId
    }
  });

  return goal;
};

// 목표 추가
const createGoal = async (goalId: number, goalContent: string, isMore: boolean, isOngoing: boolean, writerId: number, totalCount: number, startedAt: string, keptAt: string, isAchieved: boolean) => {
  const data = await prisma.goal.create({
    data: {
      goalId,
      goalContent,
      isMore,
      isOngoing,
      writerId,
      totalCount,
      startedAt,
      keptAt,
      isAchieved,
    },
  });

  return data;
};

const goalService = {
  getGoalsByUserId,
  getGoalByUserId,
  createGoal,
};

export default goalService;