import { PrismaClient } from "@prisma/client";
import date from "../modules/date";
const prisma = new PrismaClient();

// 달성 버튼을 누른 날에 달성 버튼을 누른 적이 있는지 확인
const findDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  const dailyAchievedHistory = await prisma.daily_Achieved_History.findFirst({
    where: {
      goalId: goalId,
      achievedAt: {
        lte: date.getLastDatePlus9h(targetDate),
        gte: date.getFirstDatePlus9h(targetDate)
      }
    },
  });

  return dailyAchievedHistory;
};

// 달성 버튼 눌렀을 때 오늘 달성된 값 저장
const createDailyAchievedHistory = async (goalId: number, targetMonth: string) => {
  const newDailyAchievedHistory = await prisma.daily_Achieved_History.create({
    data: {
      achievedAt: date.getCurrentDatePlus9h(),
      goalId: goalId,
      achievedMonth: targetMonth
    }
  });

  return newDailyAchievedHistory.achievedId;
}

// 달성 버튼 눌렀을 때 오늘 달성된 값 날짜 업데이트
const updateDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  const newDailyAchievedHistory = await prisma.daily_Achieved_History.updateMany({
    where: {
      goalId: goalId,
      achievedAt: {
        lte: date.getFirstDatePlus9h(targetDate),
        gte: date.getLastDatePlus9h(targetDate)
      }
    },
    data: {
      achievedAt: date.getCurrentDatePlus9h(),
    }
  });

  return newDailyAchievedHistory;
}

const deleteDailyAchievedHistoryById = async (achievedId: number) => {
  await prisma.daily_Achieved_History.delete({
    where: {
      achievedId: achievedId
    }
  });

  return
}


const findAchievedCount = async (goalId: number, achievedMonth: string) => {
  return await prisma.daily_Achieved_History.groupBy({
    by: ["achievedMonth", "goalId"],
    where: {
      goalId: goalId,
      achievedMonth: achievedMonth
    },
    _count: {
      achievedId: true,
    }
  });
}

const dailyAchievedHistoryRepository = {
  findDailyAchievedHistory,
  createDailyAchievedHistory,
  deleteDailyAchievedHistoryById,
  findAchievedCount,
  updateDailyAchievedHistory
}

export default dailyAchievedHistoryRepository;



