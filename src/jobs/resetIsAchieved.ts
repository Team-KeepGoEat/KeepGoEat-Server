import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const resetIsAchieved = async () => {
  try {
    await prisma.goal.updateMany({
      data: {
        isAchieved: true
      }
    });
  } catch (error) {
    console.log("isAchieved 업데이트 실패 ", error);
  }
};

export default resetIsAchieved;