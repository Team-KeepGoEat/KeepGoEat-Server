import { dailyAchievedHistoryRepository } from "../repository";

// 달성 버튼을 누른 날에 달성 버튼을 누른 적이 있는지 확인
const getDailyAchievedHistory = async (targetDate: string, goalId: number) => {
  return await dailyAchievedHistoryRepository.findDailyAchievedHistory(targetDate, goalId);
};

// 달성 버튼 눌렀을 때 오늘 달성된 값 저장
const createDailyAchievedHistory = async (goalId: number, targetMonth: string, achievedAt: string) => {
  return await dailyAchievedHistoryRepository.createDailyAchievedHistory(goalId, targetMonth, achievedAt);
}

const deleteDailyAchievedHistoryById = async (achievedId: number) => {
  await dailyAchievedHistoryRepository.deleteDailyAchievedHistoryById(achievedId);
}


const getAchievedCount = async (goalId: number, achievedMonth: string) => {
  const dailyAchievedHistoryList = await dailyAchievedHistoryRepository.findAchievedCount(goalId, achievedMonth);

  if (dailyAchievedHistoryList.length === 0){
    return 0;
  }

  return dailyAchievedHistoryList[0]._count.achievedId;
}

const dailyAchievedHistoryService = {
  getDailyAchievedHistory,
  createDailyAchievedHistory,
  deleteDailyAchievedHistoryById,
  getAchievedCount
}

export default dailyAchievedHistoryService;



