import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getMonthlyHistory = async (targetMonth: string, goalId: number) => {
  const monthlyAchievedCount = await prisma.monthly_Achieved_History.findFirst({
    where: {
      monthlyAchievedAt: targetMonth,
      goalId: goalId
    }
  });

  if (!monthlyAchievedCount) {
    return 0
  }

  return monthlyAchievedCount.monthlyCount;
};

const updateMonthlyHistory = async (targetMonth: string, goalId: number, isAdded: boolean) => {

  if (!isAdded) {
    const monthlyAchievedCount = await prisma.monthly_Achieved_History.updateMany({
      where: {
        monthlyAchievedAt: targetMonth,
        goalId: goalId
      },
      data: {
        monthlyCount: {
          decrement: 1,
        },
      }
    });

    return monthlyAchievedCount.monthlyCount;
  };

  const monthlyAchievedCount = await prisma.monthly_Achieved_History.updateMany({
    where: {
      monthlyAchievedAt: targetMonth,
      goalId: goalId
    },
    data: {
      monthlyCount: {
        increment: 1,
      },
    }
  });

  return monthlyAchievedCount.monthlyCount;
};

const monthlyAchievedHistoryService = {
  getMonthlyHistory,
  updateMonthlyHistory
}

export default monthlyAchievedHistoryService;
