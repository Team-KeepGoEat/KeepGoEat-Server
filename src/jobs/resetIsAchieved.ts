import { PrismaClient } from "@prisma/client";
import slack from "../modules/slack";

const prisma = new PrismaClient();

const resetIsAchieved = async () => {
  try {
    const count = await prisma.goal.updateMany({
      data: {
        isAchieved: false
      }
    });
    console.log("batch 결과 카운트 ", count);
    slack.sendBatchSuccessMessageToSlack(count.count);

  } catch (error: any) {
    slack.sendBatchErrorMessageToSlack(error.stack);
    console.log("isAchieved 업데이트 실패 ", error);
  }
};

export default resetIsAchieved;