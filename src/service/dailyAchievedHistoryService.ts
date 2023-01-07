import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import date from "../modules/date";
const prisma = new PrismaClient();

// 달성 버튼을 누른 날에 달성 버튼을 누른 적이 있는지 확인
const getDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  const dailyAchievedHistory = await prisma.daily_Achieved_History.findFirst({
    where: {
      goalId: goalId,
      achievedAt: {
        lte: date.getEndDatePlus9(targetDate),
        gte: date.getStartDatePlus9(targetDate)
      }
    },
  });
  console.log("endDate ", date.getEndDatePlus9(targetDate));
  console.log("startDate ", date.getStartDatePlus9(targetDate));

  console.log("[getDailyAchievedHistory] dailyAchievedHistory: ", dailyAchievedHistory);
  return dailyAchievedHistory;
};

// 달성 버튼 눌렀을 때 오늘 달성된 값 저장
const createDailyAchievedHistory = async (goalId: number, targetMonth: string) => {
  const newDailyAchievedHistory = await prisma.daily_Achieved_History.create({
    data: {
      achievedAt: date.getNowPlus9(),
      goalId: goalId,
      achievedMonth: targetMonth
    }
  });

  console.log("[createDailyAchievedHistory] 일별 목표 달성 기록 생성 성공 " , newDailyAchievedHistory);
  return newDailyAchievedHistory.dailyAchievedId;
}

// 달성 버튼 눌렀을 때 오늘 달성된 값 날짜 업데이트
// 안씀
const updateDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  console.log("[updateDailyAchievedHistory] endDate ", date.getStartDatePlus9(targetDate));
  console.log("[updateDailyAchievedHistory] endDate ", date.getEndDatePlus9(targetDate));

  const newDailyAchievedHistory = await prisma.daily_Achieved_History.updateMany({
    where: {
      goalId: goalId,
      achievedAt: {
        lte: date.getStartDatePlus9(targetDate),
        gte: date.getEndDatePlus9(targetDate)
      }
    },
    data: {
      achievedAt: date.getNowPlus9(),
    }
  });

  if (!newDailyAchievedHistory) {
    return null;
  }

  console.log("[updateDailyAchievedHistory] 일별 목표 달성 데이터 업데이트 ", newDailyAchievedHistory);
  return
}

const deleteDailyAchievedHistoryById = async (achievedId: number) => {
  await prisma.daily_Achieved_History.delete({
    where: {
      dailyAchievedId: achievedId
    }
  });
  
  console.log("[deleteDailyAchievedHistoryById] 월별 달성 목표 삭제 성공");
}


const getAchievedCount = async (goalId: number, achievedMonth: string) => {
  const dailyAchievedHistoryList = await prisma.daily_Achieved_History.groupBy({
    by: ["achievedMonth", "goalId"],
    where: {
      goalId: goalId,
      achievedMonth: achievedMonth
    },
    _count: {
      dailyAchievedId: true,
    }
  });
  console.log("[getAchievedCount] groupBy ", dailyAchievedHistoryList);

  if (dailyAchievedHistoryList.length === 0){
    return 0;
  }

  return dailyAchievedHistoryList[0]._count.dailyAchievedId;

}

const dailyAchievedHistoryService = {
  getDailyAchievedHistory,
  createDailyAchievedHistory,
  updateDailyAchievedHistory,
  deleteDailyAchievedHistoryById,
  getAchievedCount
}

export default dailyAchievedHistoryService;



