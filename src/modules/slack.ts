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

const sendBatchSuccessMessageToSlack = (count: number) => {
  const message = `[BATCH_SUCCESS] Job Completed. ${count} events are done`;
  sendSimpleTextToSlack(message);
};

const sendBatchErrorMessageToSlack = (error: Error) => {
  const message = `[BATCH_ERROR] Job Failed. Error message: ${error}`;
  sendSimpleTextToSlack(message);
};

const slack = {
  sendErrorMessageToSlack,
  sendBatchSuccessMessageToSlack,
  sendBatchErrorMessageToSlack,
  sendSimpleTextToSlack
};

export default slack;