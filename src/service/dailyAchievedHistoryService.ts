import dayjs from 'dayjs';
import { PrismaClient } from "@prisma/client";
import date from "../modules/date";
const prisma = new PrismaClient();

// 달성 버튼을 누른 날에 달성 버튼을 누른 적이 있는지 확인
const getDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  const dailyAchievedHistory = await prisma.daily_Achieved_History.findFirst({
    where: {
      goalId: goalId,
      achievedAt: {
        lte: date.getEndDate(targetDate),
        gte: date.getStartDate(targetDate)
      }
    },
  });

  return dailyAchievedHistory;
};

// 달성 버튼 눌렀을 때 오늘 달성된 값 저장
const createDailyAchievedHistory = async (goalId: number) => {
  const newDailyAchievedHistory = await prisma.daily_Achieved_History.create({
    data: {
      achievedAt: dayjs().format(),
      goalId: goalId
    }
  });

  return newDailyAchievedHistory.dailyAchievedId;
}

// 달성 버튼 눌렀을 때 오늘 달성된 값 날짜 업데이트
const updateDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  const newDailyAchievedHistory = await prisma.daily_Achieved_History.updateMany({
    where: {
      goalId: goalId,
      achievedAt: {
        lte: date.getEndDate(targetDate),
        gte: date.getStartDate(targetDate)
      }
    },
    data: {
      achievedAt: dayjs().format(),
    }
  });

  if (!newDailyAchievedHistory) {
    return null;
  }

  return
}

const deleteDailyAchievedHistoryById = async (achievedId: number) => {
  await prisma.daily_Achieved_History.delete({
    where: {
      dailyAchievedId: achievedId
    }
  });
}

const dailyAchievedHistoryService = {
  getDailyAchievedHistory,
  createDailyAchievedHistory,
  updateDailyAchievedHistory,
  deleteDailyAchievedHistoryById
}

export default dailyAchievedHistoryService;



