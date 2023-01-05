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
    console.log("[updateMonthlyHistory]: 존재하지 않는 월별 목표 달성임");
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

    console.log("[updateMonthlyHistory]: 월별 목표 달성 업데이트(취소) 성공, ", updatedHistory);
    return updatedHistory.monthlyCount;
  };

  const updatedHistory = await prisma.monthly_Achieved_History.update({
    where: {
      monthlyAchievedHistoryId: monthlyAchievedHistory.monthlyAchievedHistoryId
    },
    data: {
      monthlyCount: {
        increment: 1,
      },
    }
  });

  console.log("[updateMonthlyHistory]: 월별 목표 달성 업데이트(달성) 성공 ", updatedHistory);
  return updatedHistory.monthlyCount;
};

const monthlyAchievedHistoryService = {
  getMonthlyHistory,
  updateMonthlyHistory,
  getMonthlyHistoryCount
}

export default monthlyAchievedHistoryService;
