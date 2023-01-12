import axios from "axios";

const sendSimpleTextToSlack = async (message: string): Promise<void> => {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL as string, { text: message });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendErrorMessageToSlack = (method: string, originalUrl: string, error: any, uid?: number) => {
  const message = `[ERROR] [${method} ${originalUrl} ${uid ? `uid: ${uid}` : "req.user 없음"} ${JSON.stringify(error)}`;
  sendSimpleTextToSlack(message);
};

const sendBatchMessageToSlack = (count: number) => {
  const message = `[BATCH] Job Completed. ${count} events are done`;
  sendSimpleTextToSlack(message);
};

const slack = {
  sendErrorMessageToSlack,
  sendBatchMessageToSlack,
  sendSimpleTextToSlack
};

export default slack;