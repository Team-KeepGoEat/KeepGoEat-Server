import { cheeringMessageRepository } from "../repository";

const getRamdomMessage = async (isGoalExisted: boolean) => {
  const randoms = await cheeringMessageRepository.findRamdomMessage(isGoalExisted);
  
  if (randoms.length === 0) {
    return "조금만 더 힘내자!";
  } 

  return randoms[0].cheeringMessage;
}

const cheeringMessageService = {
  getRamdomMessage
}

export default cheeringMessageService;
