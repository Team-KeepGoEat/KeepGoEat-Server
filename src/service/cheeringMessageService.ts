import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getRamdomMessage = async (isGoalExisted: boolean) => {
  const messageCount = await prisma.cheering_Message.count({
    where: {
      isGoalExisted: isGoalExisted
    }
  }); // get the total count
  const skip = Math.floor(Math.random() * messageCount); // do a query that skips a random number smaller than the count and fetches 1 element.
  console.log("isGoalExisted ", isGoalExisted);
  console.log("skip ", skip);
  const randoms =  await prisma.cheering_Message.findMany({
    where: {
      isGoalExisted: isGoalExisted
    },
    skip: skip
  });

  if (randoms.length === 0) {
    return "조금만 더 힘내자!";
  } 

  return randoms[0].cheeringMessage;
}

const cheeringMessageService = {
  getRamdomMessage
}

export default cheeringMessageService;
