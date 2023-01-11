import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const resetIsAchieved = async () => {
  try {
    console.log("batch 시작 ", dayjs().format());
    const count = await prisma.goal.updateMany({
      data: {
        isAchieved: true
      }
    });
    console.log("batch 끝 ", dayjs().format());
    console.log("batch 결과 카운트 ", count);
  } catch (error) {
    console.log("isAchieved 업데이트 실패 ", error);
  }
};

export default resetIsAchieved;