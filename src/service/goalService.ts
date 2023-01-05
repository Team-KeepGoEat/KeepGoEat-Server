import { PrismaClient } from "@prisma/client";
import dailyAchievedHistoryService from "./dailyAchievedHistoryService";
import monthlyAchievedHistoryService from "./monthlyAchievedHistoryService";
import dayjs from "dayjs";
import date from "../modules/date";
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
        startedAt: goal.startedAt,
        keptAt: goal.keptAt === null ? "" : goal.keptAt,
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
      startedAt: goal.startedAt,
      keptAt: goal.keptAt === null ? "" : goal.keptAt,
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

  const goals = await prisma.goal.findMany({
    where: {
      writerId: userId,
      isOngoing: true
    },
    orderBy: {
      startedAt: "desc"
    }
  });

  const rst = goals.map(async (goal) => {
    const thisMonthCount = await monthlyAchievedHistoryService.getMonthlyHistory(currentMonth, goal.goalId);

    return {
      goalId: goal.goalId,
      goalContent: goal.goalContent,
      isMore: goal.isMore,
      isOngoing: goal.isOngoing,
      totalCount: goal.totalCount,
      startedAt: goal.startedAt,
      keptAt: goal.keptAt === null ? "" : goal.keptAt,
      isAchieved: goal.isAchieved,
      writerId: goal.writerId,
      thisMonthCount: thisMonthCount
    }
  });

  console.log("rst ", rst);

  return rst;
}

// 목표 추가
const createGoal = async (userId:number, goalContent: string, isMore: boolean, startedAt: string) => {
  const data = await prisma.goal.create({
    data: {
      goalContent,
      isMore,
      writerId:  userId,
      startedAt,
    },
  });

  const goalId = data.goalId

  return { goalId };
};

// 목표 삭제
const deleteGoal = async (goalId: number) => {
  await prisma.goal.delete({
    where: {
      goalId,
    },
  })
  return goalId;
};

// 목표 수정
const updateGoal = async (goalId: number, goalContent: string, isMore: boolean) => {
  const data = await prisma.goal.update({
    where: {
      goalId
    },
    data: {
      goalContent, 
      isMore,
    },
  });
  return data.goalId;
};

// 목표 보관
const keepGoal = async(goalId: number, isOngoing: boolean, keptAt: string) => {
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
  // 목표 테이블에 반영
  const updatedGoal = await goalService.updateIsAchieved(goalId, isAchieved); // 목표 테이블의 isAchieved 업데이트
  const currentMonth = date.getCurrentMonth(); 

  // 달성 취소했을 경우
  if (!isAchieved) {
    const now = dayjs().format();
    const dailyAchievedHistory = dailyAchievedHistoryService.getDailyAchievedHistory(now, goalId);
  
    // 달성 기록이 없는 경우
    if (!dailyAchievedHistory) {
      return null;
    }

    // 달성 기록이 있는 경우
    await dailyAchievedHistoryService.deleteDailyAchievedHistoryById(dailyAchievedHistory.dailyAchievedId); // 달성 기록 삭제 
    const thisMonthCount = await monthlyAchievedHistoryService.updateMonthlyHistory(currentMonth, goalId, isAchieved) // 달성 기록 업데이터
    
    return {
      "thisMonthCount": thisMonthCount,
      "goalId": updatedGoal.goalId
    };
  }

  // 달성 버튼 눌렀을 경우
  const now = dayjs().format();
    const dailyAchievedHistory = dailyAchievedHistoryService.getDailyAchievedHistory(now, goalId);
  
    // 달성 기록이 없는 경우
    if (!dailyAchievedHistory) {
      await dailyAchievedHistoryService.createDailyAchievedHistory(goalId); // 당일 달성 기록 추가
      const thisMonthCount = await monthlyAchievedHistoryService.updateMonthlyHistory(currentMonth, goalId, isAchieved); // montlyCount 에 +1
      
      return {
        "thisMonthCount": thisMonthCount,
        "goalId": updatedGoal.goalId
      };
    }

    await dailyAchievedHistoryService.updateDailyAchievedHistory(now, goalId) // 당일 달성 기록 갱신
    const thisMonth = await monthlyAchievedHistoryService.getMonthlyHistory(currentMonth, goalId, isAchieved); // montlyCount 에 +1

    // 당일 달성 기록 있으면 갱신
    return {
      "thisMonthCount": thisMonth.thismonthcount,
      "goalId": updatedGoal.goalId
    };  
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