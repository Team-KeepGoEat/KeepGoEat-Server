import axios from "axios";

const sendMessageToSlack = async (message: string): Promise<void> => {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL as string, { text: message });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const returnSlackMessage = (method: string, originalUrl: string, error: any, uid?: number): string => {
  return `[ERROR] [${method} ${originalUrl} ${uid ? `uid: ${uid}` : "req.user 없음"} ${JSON.stringify(error)}`;
}

const slack = {
  sendMessageToSlack,
  returnSlackMessage
};

export default slack;