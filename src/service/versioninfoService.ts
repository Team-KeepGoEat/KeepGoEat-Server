import { PrismaClient } from "@prisma/client";
import versioninfoRepository from "../repository/versioninfoRepository";

const prisma = new PrismaClient();

const getVersionInfo = async(client: string) => {
  const versionInfo = await versioninfoRepository.findversionInfo(client);

  return {
    "version": versionInfo
  };
}; 

const versioninfoService = {
  getVersionInfo,
};

export default versioninfoService;