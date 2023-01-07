import { PrismaClient } from "@prisma/client";
import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import dailyAchievedHistoryService from "./dailyAchievedHistoryService";
import dayjs from "dayjs";
import date from "../modules/date";
import achievedError from "../constants/achievedError";
import { UpdateGoalDTO } from "../interfaces/goal/UpdateGoalDTO";

const prisma = new PrismaClient();

const getGoalsForMypage = async (userId: number, sort: string) => {
  let goals;
  let isMore;

  if (sort !== "all") {
    sort === "more" ? isMore = true : isMore = false;
    goals = await prisma.goal.findMany({
      where: {        
        writerId: userId,
        isOngoing: false,
        isMore: isMore
      },
      orderBy: {
        startedAt: "desc"
      },
    });

    return goals.map((goal) => {
      return {
        goalId: goal.goalId,
        goalContent: goal.goalContent,
        isMore: goal.isMore,
        isOngoing: goal.isOngoing,
        totalCount: goal.totalCount,
        startedAt: date.dateFormatter(goal.startedAt),
        keptAt: goal.keptAt === null ? "" : date.dateFormatter(goal.keptAt),
        isAchieved: goal.isAchieved,
        writerId: goal.writerId
      }
    });
  }

  goals = await prisma.goal.findMany({
    where: {
      writerId: userId,
      isOngoing: false
    },
    orderBy: {
      startedAt: "desc"
    },
  });

  return goals.map((goal) => {
    return {
      goalId: goal.goalId,
      goalContent: goal.goalContent,
      isMore: goal.isMore,
      isOngoing: goal.isOngoing,
      totalCount: goal.totalCount,
      startedAt: date.dateFormatter(goal.startedAt),
      keptAt: goal.keptAt === null ? "" : date.dateFormatter(goal.keptAt),
      isAchieved: goal.isAchieved,
      writerId: goal.writerId
    }
  });
};

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

// 목표 추가
const createGoal = async (userId: number, createGoalDTO: CreateGoalDTO, startedAt: string) => {
  const data = await prisma.goal.create({
    data: {
      goalContent: createGoalDTO.goalContent,
      isMore: createGoalDTO.isMore,
      writerId:  userId,
      startedAt,
    },
  });

  const goalId = data.goalId

  return { goalId };
};

// 목표 삭제
const deleteGoal = async (goalId: number) => {
  const data = await prisma.goal.delete({
    where: {
      goalId,
    },
  })
  return data.goalId;
};

// 목표 수정
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

// 목표 보관
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

// 목표 달성
const achieveGoal = async (goalId: number, isAchieved: boolean) => {

  try {
    // 목표 테이블에 반영
    const updatedGoal = await goalService.updateIsAchieved(goalId, isAchieved); 
    const currentMonth = date.getCurrentMonthMinus9();
    const now = dayjs().format();

    // 달성 취소했을 경우
    if (!isAchieved) {
      
      const dailyAchievedHistory = await dailyAchievedHistoryService.getDailyAchievedHistory(now, goalId);

      // 일별 달성 기록이 없는 경우
      if (!dailyAchievedHistory) {
        console.log("달성 취소(isAchieved false) 요청 실패. 달성이 안된 목표를 취소하려함");
        return achievedError.DOUBLE_CANCELED_ERROR;
      }

      // 일별 달성 기록이 있는 경우
      await dailyAchievedHistoryService.deleteDailyAchievedHistoryById(dailyAchievedHistory.dailyAchievedId); // 달성 기록 삭제 
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
      // 당일 달성 기록 추가
      await dailyAchievedHistoryService.createDailyAchievedHistory(goalId, currentMonth); 
    
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

  // 달성 기록이 있는 경우
  console.log("이미 달성 기록이 있는 목표를 달성하려고 함");
  return achievedError.DOUBLE_ACHIEVED_ERROR;
};


// 목표 isAchieve 업데이트
const updateIsAchieved = async (goalId: number, isAchieved: boolean) => {
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
  getGoalsForMypage,
  getGoalByGoalId,
  createGoal,
  deleteGoal,
  updateGoal,
  getHomeGoalsByUserId,
  achieveGoal,
  updateIsAchieved,
  keepGoal,
};

export default goalService;