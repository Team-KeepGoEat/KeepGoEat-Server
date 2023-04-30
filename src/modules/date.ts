import dayjs, { tz } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const getCurrentMonth = (targetDate?: string) => {
  dayjs.tz.setDefault("Asia/Seoul");
  if (!targetDate) {
    return dayjs().tz().format("YYYY-MM");
  }
  return dayjs(targetDate).tz().format("YYYY-MM");
};

const getLastMonth = (targetDate?: string) => {
  dayjs.tz.setDefault("Asia/Seoul");
  if (!targetDate){
    return dayjs().tz().subtract(1, "month").format("YYYY-MM");
  }
  return dayjs(targetDate).tz().subtract(1, "month").format("YYYY-MM");
};

const getCurrentDatePlus9h = (targetDate?: string) => {
  dayjs.tz.setDefault("Asia/Seoul");
  if (!targetDate) {
    return dayjs().tz().add(9, "hour").format();
  }
  return dayjs(targetDate).tz().add(9, "hour").format();
}

const getFirstDatePlus9h = (targetDate: string) => {
  dayjs.tz.setDefault("Asia/Seoul");
  return dayjs(targetDate).tz().startOf("date").add(9, "hour").format();
}

const getLastDatePlus9h = (targetDate: string) => {
  dayjs.tz.setDefault("Asia/Seoul");
  return dayjs(targetDate).tz().endOf("date").add(9, "hour").format();
}

const setTargetDateMinus9h = (targetDate: unknown) => {
  dayjs.tz.setDefault("Asia/Seoul");
  return dayjs(targetDate as string).tz().subtract(9, "hour").format();
}

const formatDate = (targetDate: unknown) => {
  dayjs.tz.setDefault("Asia/Seoul");
  const minusDate = setTargetDateMinus9h(targetDate);
  const year  = dayjs(minusDate as string).tz().get("year");
  let month: number | string = dayjs(minusDate as string).tz().get("month") + 1;
  let date: number | string = dayjs(minusDate as string).tz().get("date");

  if (1 <= month && month <= 9) {
    month = "0" + month.toString();
  } 

  if (1 <= date && date <= 9) {
    date = "0" + date.toString();
  } 

  return year.toString() + ". " + month.toString() + ". "+ date.toString();
}

const getNow = () => {
  dayjs.tz.setDefault("Asia/Seoul");
  return dayjs().tz().format();
}

const date = {
  getCurrentMonth,
  getLastMonth,
  getFirstDatePlus9h,
  getLastDatePlus9h,
  formatDate,
  getCurrentDatePlus9h,
  setTargetDateMinus9h,
  getNow,
}

export default date;