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

// 목표 삭제
const deleteGoal = async (goalId: number) => {
  await prisma.goal.delete({
    where: {
      goalId,
    },
  })
  return goalId;
};

const goalService = {
  getGoalsForMypage,
  getGoalByGoalId,
  createGoal,
  deleteGoal,
};

export default goalService;