import { PrismaClient } from "@prisma/client";
import { CreateGoalDTO } from "../interfaces/goal/CreateGoalDTO";
import { UpdateGoalDTO } from "./../interfaces/goal/UpdateGoalDTO";
import dailyAchievedHistoryService from "./dailyAchievedHistoryService";
import dayjs from "dayjs";
import date from "../modules/date";
import achievedError from "../constants/achievedError";
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
        food: goal.food,
        criterion: goal.criterion === null ? "" : goal.criterion,
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
      food: createGoalDTO.food,
      criterion: createGoalDTO.criterion /*== null ? 어쩌구...*/ ,
      isMore: createGoalDTO.isMore,
      writerId: userId,
      startedAt,
      totalCount: 0
    }, // 기준에 빈 문자열 넣어주기
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

// const deleteCriterion = async(goalId: number) => {
//   const data = await prisma.goal.delete({
//     where: {
//       goalId: goalId,
//     },
//     data: {
//       criterion: updateCriterion.criterion
//     },
//   });
//   return data.goalId;
// }

// 플래그 변수를 만들어서 컨트롤러에서 둘 다 null이 아니면 / 둘 중 하나만 null이면 
// if문 분기처리는 결국 컨트롤러에서.....
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


const getKeptGoals = async (userId: number, sort: string) => {
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
        food: goal.food,
        criterion: goal.criterion === null ? "" : goal.criterion,
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
      food: goal.food,
      criterion: goal.criterion === null ? "" : goal.criterion,
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

const goalService = {
  getGoalByGoalId,
  createGoal,
  deleteGoal,
  updateFood,
  updateCriterion,
  updateGoal,
  getHomeGoalsByUserId,
  achieveGoal,
  updateIsAchieved,
  keepGoal,
  updateTotalCount,
  getKeptGoals
};

export default goalService;