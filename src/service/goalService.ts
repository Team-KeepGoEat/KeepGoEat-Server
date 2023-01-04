import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getGoalsForMypage = async (userId: number, isMore:boolean | string) => {
  let goals;
  
  if (isMore === "") {
    goals = await prisma.goal.findMany({
      where: {
        writerId: userId,
        isOngoing: false,
      },
      orderBy: {
        startedAt: "desc"
      },
    });
  }

  goals = await prisma.goal.findMany({
    where: {
      writerId: userId,
      isOngoing: false,
      isMore: isMore as boolean
    },
    orderBy: {
      startedAt: "desc"
    },
  });
  
  return goals;
};

const getGoalByGoalId = async (goalId: number) => {
  const goal = await prisma.goal.findUnique({
    where: {
      goalId: goalId
    }
  });

  return goal;
};

const goalService = {
  getGoalsForMypage,
  getGoalByGoalId
};

export default goalService;