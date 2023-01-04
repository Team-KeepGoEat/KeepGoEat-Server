import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getMonthlyHistory = async(targetMonth: string, goalId: number) => {
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
}

const monthlyAchievedHistoryService = {
  getMonthlyHistory,
}

export default monthlyAchievedHistoryService;
