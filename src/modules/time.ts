import dayjs from "dayjs";
import dayTime from "../constants/dayTime";

const getDayTime = async () => {
  const now = dayjs().get("hour");

  if (7 <= now && now <= 16) {
    console.log("아침")
    return dayTime.MORNING;
  }
  if (5 <= now && now <= 18) {
    console.log("저녁")
    return dayTime.DINNER;
  }
  return dayTime.SUNSET;
};

const time = {
  getDayTime,
};

export default time;