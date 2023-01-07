import dayjs from "dayjs";

const getCurrentMonthMinus9 = () => {
  return dayjs().subtract(9, "hour").format("YYYY-MM");
};

const getLastMonthMinus9 = () => {
  return dayjs().subtract(9, "hour").subtract(1, "month").format("YYYY-MM");
};

const getStartDatePlus9 = (targetDate: string) => {
  return dayjs(targetDate).add(9, "hour").startOf("date").format();
}

const getEndDatePlus9 = (targetDate: string) => {
  return dayjs(targetDate).add(9, "hour").endOf("date").format();
}

const getNowPlus9 = () => {
  return dayjs().add(9, "hour").format();
}

const dateFormatter = (targetDate: unknown) => {
  
  const year  = dayjs(targetDate as string).get("year");
  let month: number | string = dayjs(targetDate as string).get("month") + 1;
  let date: number | string = dayjs(targetDate as string).get("date");

  if (1 <= month && month <= 9) {
    month = "0" + month.toString();
  } 

  if (1 <= date && date <= 9) {
    date = "0" + date.toString();
  } 

  return year.toString() + ". " + month.toString() + ". "+ date.toString();
}

const date = {
  getCurrentMonthMinus9,
  getLastMonthMinus9,
  getStartDatePlus9,
  getEndDatePlus9,
  dateFormatter,
  getNowPlus9
}

export default date;