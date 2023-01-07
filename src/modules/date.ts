import dayjs from "dayjs";

const getCurrentMonth = () => {
  return dayjs().format("YYYY-MM");
};

const getLastMonth = () => {
  return dayjs().subtract(1, "month").format("YYYY-MM");
};

const getStartDateMinus9 = (targetDate: string) => {
  return dayjs(targetDate).subtract(9, "hour").startOf("date").format();
}

const getEndDateMinus9 = (targetDate: string) => {
  return dayjs(targetDate).subtract(9, "hour").endOf("date").format();
}

const getNowPlus9 = () => {
  return dayjs().add(9, "hour").format();
}

const dateFormatter = (targetDate: unknown) => {
  // console.log(dayjs(targetDate)
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
  getCurrentMonth,
  getLastMonth,
  getStartDateMinus9,
  getEndDateMinus9,
  dateFormatter,
  getNowPlus9
}

export default date;