import { GetUserInfoResponseDTO } from "../DTO/response";
import { userRepository, goalRepository } from "../repository";

const getUserByEmail = async (email: string, platform: string) => {
  return userRepository.findUserByEmailAndPlatform(email, platform);
};

const updateUserByUserId = async (userId: number, refreshToken: string) => {
  return userRepository.updateUserByUserId(userId, refreshToken);
}

const getUserByUserId = async (userId: number) => {
  return userRepository.findUserByUserId(userId);
};

const createUser = async (email: string, name: string | null | undefined, platform: string, refreshToken: string) => {
  return userRepository.createUser(email, name, platform, refreshToken);
}

const getUserByRefreshToken = async (refreshToken: string) => {
  return userRepository.findUserByRefreshToken(refreshToken);
}

const deleteUserById = async (userId: number) => {

  const foundUser = await getUserByUserId(userId);

  if (!foundUser) {
    return null
  }

  const deletedUser = userRepository.deleteUserById(userId);

  return deletedUser;

}

const getAccountInfo = async (userId: number) => {
  const foundUser = await userRepository.findUserByUserId(userId);
  const keptGoalCount = await goalRepository.findKeptGoalCount(userId);

  let userName = foundUser?.name;
  if (userName === null || userName === undefined) {
    userName = "유저 실명을 받아오지 못했습니다.";
  }

  const responseDTO: GetUserInfoResponseDTO = {
    name: userName,
    email: foundUser?.email,
    keptGoalsCount: keptGoalCount
  }

  return responseDTO;
};

const userService = {
  getUserByEmail,
  createUser,
  getUserByUserId,
  getUserByRefreshToken,
  updateUserByUserId,
  deleteUserById,
  getAccountInfo,
};

export default userService;