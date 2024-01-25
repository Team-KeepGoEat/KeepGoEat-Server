import { dailyAchievedHistoryService } from "../service";
import dayjs from "dayjs";
import { cheeringMessageService } from "../service";
import { date, boxCounter, time } from "../modules";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { goalError } from "../error/customError";
import { goalRepository } from "../repository";
import { GetGoalResponseDTO, GetHomeGoalResponseDTO, GetHomeGoalsResponseDTO, GetKeptGoalsResponseDTO, GetGoalHistoryResponseDTO, AchieveGoalResponseDTO } from "../DTO/response";
import { UpdateGoalRequestDTO, CreateGoalRequestDTO } from "../DTO/request";

dayjs.extend(utc);
dayjs.extend(timezone);

const getGoalByGoalId = async (goalId: number, now: string) => {
  const foundGoals = await goalRepository.findGoalByGoalId(goalId);

  const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(+goalId, date.getCurrentMonth(now));
  const lastMonthCount = await dailyAchievedHistoryService.getAchievedCount(+goalId, date.getLastMonth(now));
  
  if (foundGoals != null) {
    const responseDTO: GetGoalHistoryResponseDTO  = {
      goalId: foundGoals.goalId,
      isMore: foundGoals.isMore,
      thisMonthCount: thisMonthCount,
      lastMonthCount: lastMonthCount,
      food: foundGoals.food, 
      criterion: foundGoals.criterion === null ? "" : foundGoals.criterion, 
      blankBoxCount: boxCounter.getBlankBoxCount(),
      emptyBoxCount: boxCounter.getEmptyBoxCount(thisMonthCount)
    };
    return responseDTO;
  }
  return null;
};

const getHomeGoalsByUserId = async (currentMonth: string, userId: number, now: string) => {
  const foundGoals = await goalRepository.findHomeGoalsByUserId(currentMonth, userId, now);

  let goalResponseDTOs: GetHomeGoalResponseDTO[] = []
  if (foundGoals != null) {
    goalResponseDTOs = await Promise.all(
      foundGoals.map(async (goal) => {
        const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(goal.goalId, currentMonth);

        return {
          goalId: goal.goalId,
          food: goal.food,
          criterion: goal.criterion === null ? "" : goal.criterion,
          isMore: goal.isMore,
          isOngoing: goal.isOngoing,
          totalCount: goal.totalCount,
          startedAt: date.formatDate(goal.startedAt),
          keptAt: goal.keptAt === null ? "" : date.formatDate(goal.keptAt),
          isAchieved: goalService.isAchievedToday(goal.achievedAt, goal.isAchieved, now),
          writerId: goal.writerId,
          thisMonthCount: thisMonthCount
        };
      }));
  }

  let isGoalExisted = false;
  if (foundGoals.length != 0) {
    isGoalExisted = true;
  }
  const cheeringMessage = await cheeringMessageService.getRamdomMessage(isGoalExisted);
  const currentDayTime = await time.getDayTime();

  const responseDTO :GetHomeGoalsResponseDTO = {
    goals: goalResponseDTOs,
    goalCount: goalResponseDTOs.length,
    cheeringMessage: cheeringMessage,
    daytime: currentDayTime
  }
  
  return responseDTO;

};

const createGoal = async (userId: number, createGoalDTO: CreateGoalRequestDTO, startedAt: string) => {
  return await goalRepository.createGoal(userId, createGoalDTO, startedAt);
};

const deleteGoal = async (goalId: number) => {
  return await goalRepository.deleteGoal(goalId);
};

const updateGoal = async (goalId: number, updateGoalDTO: UpdateGoalRequestDTO) => {
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

      const responseDTO: AchieveGoalResponseDTO = {
        thisMonthCount: thisMonthCount,
        goalId: updatedGoal.goalId,
        updatedIsAchieved: updatedGoal.isAchieved
      };

      return responseDTO
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

    const responseDTO: AchieveGoalResponseDTO = {
      thisMonthCount: thisMonthCount,
      goalId: updatedGoal.goalId,
      updatedIsAchieved: updatedGoal.isAchieved
    };

    return responseDTO
    

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
  const foundGoals = await goalRepository.findKeptGoals(userId, sort, now);
  let goalResponseDTOs: GetGoalResponseDTO[] = [];
  
  foundGoals.forEach (foundGoal => {
    const goalResponseDTO: GetGoalResponseDTO = {
      goalId: foundGoal.goalId,
      food: foundGoal.food,
      criterion: foundGoal.criterion,
      isMore: foundGoal.isMore,
      isOngoing: foundGoal.isOngoing,
      totalCount: foundGoal.totalCount,
      startedAt: foundGoal.startedAt,
      keptAt: foundGoal.keptAt,
      isAchieved: foundGoal.isAchieved,
      writerId: foundGoal.writerId
    }

    goalResponseDTOs.push(goalResponseDTO)
  });

  const responseDTO: GetKeptGoalsResponseDTO = {
    goals: goalResponseDTOs,
    goalCount: goalResponseDTOs.length
  }

  return responseDTO

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