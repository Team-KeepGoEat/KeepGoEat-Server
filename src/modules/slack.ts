import axios from "axios";

const sendMessageToSlack = async (message: string): Promise<void> => {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL as string, { text: message });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const slack = {
  sendMessageToSlack,
};

export default slack;