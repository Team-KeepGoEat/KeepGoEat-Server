import { mypageRepository } from "../repository";

const getAccountInfoForMyPage = async (userId: number) => {
  return mypageRepository.findAccountInfoForMyPage(userId);
};

const getKeptGoalsCountForMyPage = async (userId: number) => {
  return mypageRepository.findKeptGoalsCountForMyPage(userId);
}
const mypageService = {
  getAccountInfoForMyPage,
  getKeptGoalsCountForMyPage,
};

export default mypageService