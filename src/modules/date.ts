import dayjs from "dayjs";

const getCurrentMonth = () => {
  return dayjs().format("YYYY-MM");
};

const getLastMonth = () => {
  return dayjs().subtract(1, "month").format("YYYY-MM");
};

const getStartDate = (targetDate: string) => {
  return dayjs(targetDate).startOf("date").format();
}

const getEndDate = (targetDate: string) => {
  return dayjs(targetDate).endOf("date").format();
}

const dateFormatter = (targetDate: unknown) => {
  // console.log(dayjs(targetDate)
  let year = dayjs(targetDate as string).get("year");
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
  getStartDate,
  getEndDate,
  dateFormatter
}

export default date;