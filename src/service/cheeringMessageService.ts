import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getRamdomMessage = async () => {
  const messageCount = await prisma.cheering_Message.count(); // get the total count
  const skip = Math.floor(Math.random() * messageCount); // do a query that skips a random number smaller than the count and fetches 1 element.
  const ramdoms =  await prisma.cheering_Message.findMany({
    skip: skip
  });

  console.log("ramdoms ", ramdoms);
  return ramdoms[0];
}

const cheeringMessageService = {
  getRamdomMessage
}

export default cheeringMessageService;
