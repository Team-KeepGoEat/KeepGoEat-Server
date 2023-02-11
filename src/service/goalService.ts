import { PrismaClient } from "@prisma/client";
import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import dailyAchievedHistoryService from "./dailyAchievedHistoryService";
import dayjs from "dayjs";
import date from "../modules/date";
import achievedError from "../constants/achievedError";
import { UpdateGoalDTO } from "../interfaces/goal/UpdateGoalDTO";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

const getGoalByGoalId = async (goalId: number) => {
  const goal = await prisma.goal.findUnique({
    where: {
      goalId: goalId
    }
  });

  return goal;
};

const getHomeGoalsByUserId = async (currentMonth: string, userId: number) => {

  const fountGoals = await prisma.goal.findMany({
    where: {
      writerId: userId,
      isOngoing: true
    },
    orderBy: {
      startedAt: "desc"
    }
  });

  const result = await Promise.all(
    fountGoals.map(async (goal) => {
      const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(goal.goalId, currentMonth);

      return {
        goalId: goal.goalId,
        goalContent: goal.goalContent,
        isMore: goal.isMore,
        isOngoing: goal.isOngoing,
        totalCount: goal.totalCount,
        startedAt: date.dateFormatter(goal.startedAt),
        keptAt: goal.keptAt === null ? "" : date.dateFormatter(goal.keptAt),
        isAchieved: goal.isAchieved,
        writerId: goal.writerId,
        thisMonthCount: thisMonthCount
      }
    })
  );

  return result;
};

const createGoal = async (userId: number, createGoalDTO: CreateGoalDTO, startedAt: string) => {
  const data = await prisma.goal.create({
    data: {
      goalContent: createGoalDTO.goalContent,
      isMore: createGoalDTO.isMore,
      writerId:  userId,
      startedAt,
      totalCount: 0
    },
  });
  const goalId = data.goalId
  
  return { goalId };
  
};

const deleteGoal = async (goalId: number) => {
  const data = await prisma.goal.delete({
    where: {
      goalId: goalId,
    },
  })
  return data.goalId;
};

const updateGoal = async (goalId: number, updateGoalDTO: UpdateGoalDTO) => {
  const data = await prisma.goal.update({
    where: {
      goalId
    },
    data: {
      goalContent: updateGoalDTO.goalContent,
    },
  });
  return data.goalId;
};

const keepGoal = async (goalId: number, isOngoing: boolean, keptAt: string) => {
  const data = await prisma.goal.update({
    where: {
      goalId,
    },
    data: {
      isOngoing,
      keptAt,
    }
  });
  return data.goalId;
}

const achieveGoal = async (goalId: number, isAchieved: boolean) => {

  try {
    // 목표 테이블에 반영
    const updatedGoal = await goalService.updateIsAchieved(goalId, isAchieved); 
    const currentMonth = date.getCurrentMonthMinus9();

    dayjs.tz.setDefault("Asia/Seoul");
    const now = dayjs().tz().format(); // 클라한테서 날짜값 받아야 할 듯

    // 달성 취소했을 경우
    if (!isAchieved) {
      
      const dailyAchievedHistory = await dailyAchievedHistoryService.getDailyAchievedHistory(now, goalId);

      // 일별 달성 기록이 없는 경우
      if (!dailyAchievedHistory) {
        console.log("달성 취소(isAchieved false) 요청 실패. 달성이 안된 목표를 취소하려함");
        return achievedError.DOUBLE_CANCELED_ERROR;
      }

      // 일별 달성 기록이 있는 경우 - 달성 기록 삭제 및 total count -1 
      await dailyAchievedHistoryService.deleteDailyAchievedHistoryById(dailyAchievedHistory.achievedId); 
      await updateTotalCount(goalId, isAchieved);

      const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(goalId, currentMonth);

      return {
        "thisMonthCount": thisMonthCount,
        "goalId": updatedGoal.goalId,
        "updatedIsAchieved": updatedGoal.isAchieved
      };
    }

    // 달성 버튼 눌렀을 경우
    const dailyAchievedHistory = await dailyAchievedHistoryService.getDailyAchievedHistory(now, goalId);

    // 일별 달성 기록이 없는 경우
    if (!dailyAchievedHistory) {
      // 당일 달성 기록 추가 및 totalCount+1
      await dailyAchievedHistoryService.createDailyAchievedHistory(goalId, currentMonth); 
      await updateTotalCount(goalId, isAchieved);
      
      const thisMonthCount = await dailyAchievedHistoryService.getAchievedCount(goalId, currentMonth);

      return {
        "thisMonthCount": thisMonthCount,
        "goalId": updatedGoal.goalId,
        "updatedIsAchieved": updatedGoal.isAchieved
      };
    }

  } catch (error) {
    console.log("achieveGoal service 에러 발생 ", error);
    throw error;
  }

  // 달성 기록이 있는 경우 - try 문 안에 넣어줘야함
  console.log("이미 달성 기록이 있는 목표를 달성하려고 함");
  return achievedError.DOUBLE_ACHIEVED_ERROR;
};

const updateTotalCount = async (goalId: number, isAchieved: boolean) => {
  // 취소한 목표인 경우 total count -1
  if (!isAchieved) {
    await prisma.goal.update({
      where: {
        goalId: goalId
      },
      data: {
        totalCount: {
          decrement: 1
        }
      }
    });

    return
  }

  await prisma.goal.update({
    where: {
      goalId: goalId
    },
    data: {
      totalCount: {
        increment: 1
      }
    }
  });

  return
}


// 목표 isAchieve 업데이트
const updateIsAchieved = async (goalId: number, isAchieved: boolean) => {
  // 여기서도 더블 달성이랑 더블 취소 에러 로직 필요한거 아닌가?? 
  const updatedGoal = await prisma.goal.update({
    where: {
      goalId: goalId
    },
    data: {
      isAchieved: isAchieved
    }
  });

  return updatedGoal;
};

const goalService = {
  getGoalByGoalId,
  createGoal,
  deleteGoal,
  updateGoal,
  getHomeGoalsByUserId,
  achieveGoal,
  updateIsAchieved,
  keepGoal,
  updateTotalCount
};

export default goalService;