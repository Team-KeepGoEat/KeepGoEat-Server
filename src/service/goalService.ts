import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getGoalsByUserId = async (userId: number) => {
  const allGoals = await await prisma.goal.findMany({
    where: {
      writer_id: userId,
    },
  });

  return allGoals;
};

const goalService = {
  getGoalsByUserId
};

export default goalService;