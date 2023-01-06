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

const date = {
  getCurrentMonth,
  getLastMonth,
  getStartDate,
  getEndDate
}

export default date;