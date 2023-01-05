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
    return null;
  }

  return monthlyAchievedCount;
};

const getMonthlyHistoryCount = async (targetMonth: string, goalId: number) => {
  const monthlyAchievedHistory = await getMonthlyHistory(targetMonth, goalId);

  if (!monthlyAchievedHistory) {
    return 0;
  }

  return monthlyAchievedHistory.monthlyCount;
};

const updateMonthlyHistory = async (targetMonth: string, goalId: number, isAdded: boolean) => {

  const monthlyAchievedHistory = await getMonthlyHistory(targetMonth, goalId);
  
  if (!monthlyAchievedHistory) {
    return null;
  }

  if (!isAdded) {
    const updatedHistory = await prisma.monthly_Achieved_History.update({
      where: {
        monthlyAchievedHistoryId: monthlyAchievedHistory.monthlyAchievedHistoryId
      },
      data: {
        monthlyCount: {
          decrement: 1,
        },
      }
    });

    return updatedHistory.monthlyCount;
  };

  const updatedHistory = await prisma.monthly_Achieved_History.update({
    where: {
      monthlyAchievedHistoryId: monthlyAchievedHistory.monthlyAchievedHistoryId
    },
    data: {
      monthlyCount: {
        decrement: 1,
      },
    }
  });

  return updatedHistory.monthlyCount;
};

const monthlyAchievedHistoryService = {
  getMonthlyHistory,
  updateMonthlyHistory,
  getMonthlyHistoryCount
}

export default monthlyAchievedHistoryService;
