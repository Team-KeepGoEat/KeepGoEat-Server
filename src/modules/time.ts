import dayjs from "dayjs";
import dayTime from "../constants/dayTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const getDayTime = async () => {
  const currentHour = dayjs().tz().get("hour");

  if (7 <= currentHour && currentHour < 16) {
    return dayTime.MORNING;
  }
  if ((0 <= currentHour && currentHour <= 4) || (18 <= currentHour && currentHour < 24)) {
    return dayTime.DINNER;
  }
  return dayTime.SUNSET;
};

const time = {
  getDayTime,
};

export default time