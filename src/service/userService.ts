import { userRepository } from "../repository";

const getUserByEmail = async (email: string, platform: string) => {
  return userRepository.findUserByEmail(email, platform);
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

const userService = {
  getUserByEmail,
  createUser,
  getUserByUserId,
  getUserByRefreshToken,
  updateUserByUserId,
  deleteUserById
};

export default userService;