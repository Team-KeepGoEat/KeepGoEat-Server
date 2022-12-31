import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getGoalsByUserId = async (userId: number) => {
  console.log("userId ", userId);
  const allGoals = await prisma.goal.findMany({
    where: {
      writer_id: userId
    }
  });

  console.log("allGoals ", allGoals);
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

const goalService = {
  getGoalsByUserId,
  getGoalByUserId
};

export default goalService;