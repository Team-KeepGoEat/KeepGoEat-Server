import { PrismaClient } from "@prisma/client";
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
        startedAt: goal.startedAt,
        keptAt: goal.keptAt === null ? "" : goal.keptAt,
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
      startedAt: goal.startedAt,
      keptAt: goal.keptAt === null ? "" : goal.keptAt,
      isAchieved: goal.isAchieved,
      writerId: goal.writerId
    }
  });
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
const createGoal = async (userId:number, goalContent: string, isMore: boolean, startedAt: string) => {
  const data = await prisma.goal.create({
    data: {
      goalContent,
      isMore,
      writerId:  userId,
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

// 목표 수정
const updateGoal = async (goalId: number, goalContent: string) => {
  const data = await prisma.goal.update({
    where: {
      goalId
    },
    data: {
      goalContent 
    },
  });
  return data.goalId;
}

const goalService = {
  getGoalsForMypage,
  getGoalByGoalId,
  createGoal,
  deleteGoal,
  updateGoal,
};

export default goalService;