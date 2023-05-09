import { Goal, PrismaClient } from "@prisma/client";
import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import { UpdateGoalDTO } from "./../interfaces/goal/UpdateGoalDTO";
import { dailyAchievedHistoryService, goalService } from "../service";
import dayjs from "dayjs";
import date from "../modules/date";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { goalError } from "../error/customError";

dayjs.extend(utc);
dayjs.extend(timezone);

const prisma = new PrismaClient();

const findGoalByGoalId = async (goalId: number) => {
  const goal = await prisma.goal.findUnique({
    where: {
      goalId: goalId
    }
  });

  return goal;
};

const findHomeGoalsByUserId = async (currentMonth: string, userId: number, now: string) => {

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
      }
    })
  );

  return result;
};

const createGoal = async (userId: number, createGoalDTO: CreateGoalDTO, startedAt: string) => {
  
  const ongoingGoalCount = await prisma.goal.count({
    where: {
      writerId: userId,
      isOngoing: true
    }
  }); 

  if (ongoingGoalCount >= 3) {
    return goalError.MAX_GOAL_COUNT_ERROR;
  }

  const data = await prisma.goal.create({
    data: {
      food: createGoalDTO.food,
      criterion: createGoalDTO.criterion === "" ? null : createGoalDTO.criterion,
      isMore: createGoalDTO.isMore,
      writerId: userId,
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
    data: { // ex. 하루 한끼 가지 덜 먹기 -> 3일에 한끼 가지 덜 먹기 : 음식은 null로 -> DB에 3일에 한끼 null먹기가 들어가니까 문제가 되는 것.
      food: updateGoalDTO.food, // 지금은 DB 쿼리를 그대로 받아서 그대로 날리는 상태. 수정되지 않은 값에는 null 값을 넣어줘야 함.
      criterion: updateGoalDTO.criterion // 기준은 null이 아닌데 음식이 null인 경우에는 데이터에 음식을 넣어줘야 하는것
    },
  });
  return data.goalId;
};

const updateFood = async(goalId: number, updateGoalDTO: UpdateGoalDTO) => {
  const data = await prisma.goal.update({
    where: {
      goalId
    },
    data: {
      food: updateGoalDTO.food
    }
  });
  return data.goalId;
};

const updateCriterion = async(goalId: number, updateGoalDTO: UpdateGoalDTO) => {
  const data = await prisma.goal.update({
    where: {
      goalId
    },
    data: {
      criterion: updateGoalDTO.criterion
    }
  })
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

const updateTotalCount = async (goalId: number, isAchieved: boolean) => {
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


// 목표 T에서 isAchieve 업데이트
const updateIsAchieved = async (goalId: number, isAchieved: boolean, achievedAt: string) => {
  const updatedGoal = await prisma.goal.update({
    where: {
      goalId: goalId
    },
    data: {
      isAchieved: isAchieved,
      achievedAt: achievedAt
    }
  });

  return updatedGoal;
};

const findKeptGoals = async (userId: number, sort: string, now: string) => {
  let isMore;
  if (sort !== "all") {
    sort === "more" ? isMore = true : isMore = false;
    const keptGoals = await prisma.goal.findMany({
      where: {        
        writerId: userId,
        isOngoing: false,
        isMore: isMore
      },
      orderBy: {
        startedAt: "desc"
      },
    });

    return sortKeptGoals(keptGoals, now);
  }

  const keptGoals = await prisma.goal.findMany({
    where: {        
      writerId: userId,
      isOngoing: false,
    },
    orderBy: {
      startedAt: "desc"
    },
  });

  return sortKeptGoals(keptGoals, now);
};

const sortKeptGoals = (keptGoals: Goal[], now: string) => {
  return keptGoals.map((goal) => {
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
      writerId: goal.writerId
    }
  });
};


const goalRepository = {
  findGoalByGoalId,
  createGoal,
  deleteGoal,
  updateFood,
  updateCriterion,
  updateGoal,
  findHomeGoalsByUserId,
  updateIsAchieved,
  keepGoal,
  updateTotalCount,
  findKeptGoals,
};

export default goalRepository;