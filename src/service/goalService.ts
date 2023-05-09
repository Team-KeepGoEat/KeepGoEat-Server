import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import { UpdateGoalDTO } from "./../interfaces/goal/UpdateGoalDTO";
import dailyAchievedHistoryService from "./dailyAchievedHistoryService";
import dayjs from "dayjs";
import date from "../modules/date";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { goalError } from "../error/customError";
import goalRepository from "../repository/goalRepository";

dayjs.extend(utc);
dayjs.extend(timezone);

const getGoalByGoalId = async (goalId: number) => {
  return await goalRepository.findGoalByGoalId(goalId);
};

const getHomeGoalsByUserId = async (currentMonth: string, userId: number, now: string) => {
  return await goalRepository.findHomeGoalsByUserId(currentMonth, userId, now);
};

const createGoal = async (userId: number, createGoalDTO: CreateGoalDTO, startedAt: string) => {
  return await goalRepository.createGoal(userId, createGoalDTO, startedAt);
};

const deleteGoal = async (goalId: number) => {
  return await goalRepository.deleteGoal(goalId);
};

const updateGoal = async (goalId: number, updateGoalDTO: UpdateGoalDTO) => {
  return await goalRepository.updateGoal(goalId, updateGoalDTO);
};

const keepGoal = async (goalId: number, isOngoing: boolean, keptAt: string) => {
  return await goalRepository.keepGoal(goalId, isOngoing, keptAt);    
}

const achieveGoal = async (goalId: number, isAchieved: boolean, now: string, nowPlus9h: string ) => {

  try {
    const currentMonth = date.getCurrentMonth(now);

    const dailyAchievedHistory = await dailyAchievedHistoryService.getDailyAchievedHistory(now, goalId);

    // 달성 취소했을 경우
    if (!isAchieved) {
    
      // 일별 달성 기록이 없는 경우
      if (!dailyAchievedHistory) {
        console.log("달성 취소(isAchieved false) 요청 실패. 달성이 안된 목표를 취소하려함");
        return goalError.DOUBLE_CANCELED_ERROR;
      }

      // 일별 달성 기록이 있는 경우
      // 1. Goal T에서 isAchieved 반영 및 achievedAt 타임스탬프 업데이트
      const updatedGoal = await updateIsAchieved(goalId, isAchieved, nowPlus9h); 

      // 2. 달성 기록 삭제 및 total count -1 
      await dailyAchievedHistoryService.deleteDailyAchievedHistoryById(dailyAchievedHistory.achievedId); 
      await updateTotalCount(goalId, isAchieved);

      // 3. thisMonthCount 가져오기
      const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(goalId, currentMonth);

      return {
        "thisMonthCount": thisMonthCount,
        "goalId": updatedGoal.goalId,
        "updatedIsAchieved": updatedGoal.isAchieved
      };
    }

    // 달성 버튼 눌렀을 경우
    // 일별 달성 기록이 있는 경우
    if (dailyAchievedHistory) {
      console.log("이미 달성 기록이 있는 목표를 달성하려고 함");
      return goalError.DOUBLE_ACHIEVED_ERROR;
    }

    // 일별 달성 기록이 없는 경우
    // 1. Goal T에서 isAchieved 반영 및 achievedAt 타임스탬프 업데이트
    const updatedGoal = await updateIsAchieved(goalId, isAchieved, nowPlus9h); 

    // 2. 당일 달성 기록 추가 및 totalCount+1
    await dailyAchievedHistoryService.createDailyAchievedHistory(goalId, currentMonth, nowPlus9h); 
    await updateTotalCount(goalId, isAchieved);
    
    // 3. thisMonthCount 가져오기
    const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(goalId, currentMonth);

    return {
      "thisMonthCount": thisMonthCount,
      "goalId": updatedGoal.goalId,
      "updatedIsAchieved": updatedGoal.isAchieved
    };
    

  } catch (error) {
    console.log("achieveGoal service 에러 발생 ", error);
    throw error;
  }
};

const updateTotalCount = async (goalId: number, isAchieved: boolean) => {
  await goalRepository.updateTotalCount(goalId, isAchieved);
  return
}

const updateIsAchieved = async (goalId: number, isAchieved: boolean, achievedAt: string) => {
  return await goalRepository.updateIsAchieved(goalId, isAchieved, achievedAt);
};


const getKeptGoals = async (userId: number, sort: string, now: string) => {
  return await goalRepository.findKeptGoals(userId, sort, now);
};

const isAchievedToday = (achievedAt: Date | null, isAchieved: boolean, now: string) => {

  if (achievedAt == null) {
    console.log("achievedAt이 null");
    return false;
  }

  const startTime = dayjs(date.getFirstDatePlus9h(now)).toDate();
  const endTime = dayjs(date.getLastDatePlus9h(now)).toDate();

  console.log("startTime: " + startTime);
  console.log("endTime: " + endTime);


  if (startTime <= dayjs(achievedAt).toDate() && dayjs(achievedAt).toDate() <= endTime) {
    console.log("achievedAt이 api 호출 당일에 업데이트됨 achievedAt: " + achievedAt);
    return isAchieved;
  }

  console.log("achievedAt이 api 호출 당일보다 이전에 업데이트 됨 achievedAt: " + achievedAt);

  return false;

}

const goalService = {
  getGoalByGoalId,
  createGoal,
  deleteGoal,
  updateGoal,
  getHomeGoalsByUserId,
  achieveGoal,
  updateIsAchieved,
  keepGoal,
  updateTotalCount,
  getKeptGoals,
  isAchievedToday
};

export default goalService;