import dayjs from "dayjs";
import { TOTAL_BLANK_BOX_COUNT } from "../constants/totalBlankBoxCount";

const getBlankBoxCount = () => {
  return TOTAL_BLANK_BOX_COUNT - dayjs().daysInMonth();
};

const getEmptyBoxCount = (thisMonthCount: number) => {
  return TOTAL_BLANK_BOX_COUNT - getBlankBoxCount() - thisMonthCount;
};

const boxCounter = {
  getBlankBoxCount,
  getEmptyBoxCount
}

export default boxCounter;