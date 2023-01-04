import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getGoalsByUserId = async (userId: number) => {
  const allGoals = await prisma.goal.findMany({
    where: {
      writerId: userId
    }
  });

  return allGoals;
};

const getGoalByGoalId = async (goalId: number) => {
  const goal = await prisma.goal.findUnique({
    where: {
      goalId: goalId
    }
  });

  return goal;
};

// 목표 추가
const createGoal = async (goalContent: string, isMore: boolean, startedAt:string) => {
  const data = await prisma.goal.create({
    data: {
      goalContent,
      isMore,
      writerId: 1,
      startedAt,
    },
  });

  const goalId = data.goalId

  return { goalId };
};

const goalService = {
  getGoalsByUserId,
  createGoal,
  getGoalByGoalId
};

export default goalService;