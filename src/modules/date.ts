import dayjs from "dayjs";

const getCurrentMonth = () => {
  return dayjs().format("YYYY-MM") 
};

const getLastMonth = () => {
  return dayjs().format("YYYY-MM")
};

const date = {
  getCurrentMonth,
  getLastMonth
}

export default date;