import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import slack from "../modules/slack";

const prisma = new PrismaClient();

const resetIsAchieved = async () => {
  try {
    console.log("batch 시작 ", dayjs().format());
    const count = await prisma.goal.updateMany({
      data: {
        isAchieved: false
      }
    });
    console.log("batch 끝 ", dayjs().format());
    console.log("batch 결과 카운트 ", count);
    slack.sendBatchMessageToSlack(count.count);

  } catch (error) {
    slack.sendSimpleTextToSlack("[ERROR] isAchieved 업데이트 job 에러");
    console.log("isAchieved 업데이트 실패 ", error);
  }
};

export default resetIsAchieved;