import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getMonthlyHistory = async (targetMonth: string, goalId: number) => {
  const monthlyAchievedHistory = await prisma.monthly_Achieved_History.findFirst({
    where: {
      monthlyAchievedAt: targetMonth,
      goalId: goalId
    }
  });

  if (!monthlyAchievedHistory) {
    return null;
  }

  return monthlyAchievedHistory;
};

const getMonthlyHistoryCount = async (targetMonth: string, goalId: number) => {
  const monthlyAchievedCount = await getMonthlyHistory(targetMonth, goalId);
  console.log("monthlyAchievedHistory ", monthlyAchievedCount)
  if (!monthlyAchievedCount) {
    return 0;
  }

  console.log("monthlyAchievedHistory cnt", monthlyAchievedCount.monthlyCount)
  return monthlyAchievedCount.monthlyCount;
};

const updateMonthlyHistory = async (targetMonth: string, goalId: number, isAdded: boolean) => {

  const monthlyAchievedHistory = await getMonthlyHistory(targetMonth, goalId);

  // 목표 달성 취소일 때
  if (!isAdded) {
    // 월별 목표 달성 기록이 없는 경우
    if (!monthlyAchievedHistory) {
      console.log("[updateMonthlyHistory]: 존재하지 않는 월별 목표 달성임");
      return null;
    }

    // 월별 목표 달성 기록이 있는 경우 -1해줌
    const updatedHistory = await monthlyAchievedHistoryService
      .updatedHistoryCount(monthlyAchievedHistory.monthlyAchievedHistoryId, false);

    console.log("[updateMonthlyHistory]: 월별 목표 달성 업데이트(취소) 성공, ", updatedHistory.monthlyCount);
    return updatedHistory.monthlyCount;

  }

  // 월별 목표 달성 기록이 없는 경우
  if (!monthlyAchievedHistory) {
    // 월별 목표 달성 기록 추가
    const createdHistory = await prisma.monthly_Achieved_History.create({
      data: {
        monthlyAchievedAt: targetMonth,
        goalId: goalId,
        monthlyCount: 1
      }
    });
    console.log("[updateMonthlyHistory]: 월별 목표 달성 생성 성공");
    return createdHistory.monthlyCount;
  }

  // 월별 목표 달성 기록이 있는 경우
  // 월별 목표 달성 기록 업데이트
  const updatedHistory = await monthlyAchievedHistoryService
    .updatedHistoryCount(monthlyAchievedHistory.monthlyAchievedHistoryId, true);

  console.log("[updateMonthlyHistory]: 월별 목표 달성 업데이트(추가) 성공, ", updatedHistory.monthlyCount);

  return updatedHistory.monthlyCount;
  
  
};

const updatedHistoryCount = async (monthlyAchievedHistoryId: number, isAdded: boolean) => {

  // 월별 달성 내역 -1
  if (!isAdded) {
    const updatedHistory = await prisma.monthly_Achieved_History.update({
      where: {
        monthlyAchievedHistoryId: monthlyAchievedHistoryId
      },
      data: {
          monthlyCount: {
          decrement: 1,
        },
      }
    });

    console.log("월별 달성 내역 -1");
    return updatedHistory;
  }

  // 월별 달성 내역 +1
  const updatedHistory =await prisma.monthly_Achieved_History.update({
    where: {
      monthlyAchievedHistoryId: monthlyAchievedHistoryId
    },
    data: {
        monthlyCount: {
        increment: 1,
      },
    }
  });

  console.log("월별 달성 내역 +1");
  return updatedHistory;

}



const monthlyAchievedHistoryService = {
  getMonthlyHistory,
  updateMonthlyHistory,
  updatedHistoryCount,
  getMonthlyHistoryCount
}

export default monthlyAchievedHistoryService;
