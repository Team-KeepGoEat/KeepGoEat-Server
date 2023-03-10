import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TOTAL_BLANK_BOX_COUNT = 35

const getBlankBoxCount = () => {
  dayjs.tz.setDefault("Asia/Seoul");
  return TOTAL_BLANK_BOX_COUNT - dayjs().tz().daysInMonth();
};

const getEmptyBoxCount = (thisMonthCount: number) => {
  return TOTAL_BLANK_BOX_COUNT - getBlankBoxCount() - thisMonthCount;
};

const boxCounter = {
  getBlankBoxCount,
  getEmptyBoxCount
}

export default boxCounter;