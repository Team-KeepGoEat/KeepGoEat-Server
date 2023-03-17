import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const findRamdomMessage = async (isGoalExisted: boolean) => {
  const messageCount = await prisma.cheering_Message.count({
    where: {
      isGoalExisted: isGoalExisted
    }
  }); // get the total count
  const skip = Math.floor(Math.random() * messageCount); // do a query that skips a random number smaller than the count and fetches 1 element.
 
  const randoms =  await prisma.cheering_Message.findMany({
    where: {
      isGoalExisted: isGoalExisted
    },
    skip: skip
  });

  return randoms;
}

const cheeringMessageRepository = {
  findRamdomMessage
}

export default cheeringMessageRepository;
