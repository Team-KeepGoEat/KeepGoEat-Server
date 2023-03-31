import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findversionInfo = async(client: string) => {
  let osTypeName;
  if(client) {
    client === "iOS" ? osTypeName = "iOS" : osTypeName = "AOS"
    return await prisma.version_Info.findMany({
      where: {
        osType: osTypeName,
      }
    });
  }
};

const versioninfoRepository = {
  findversionInfo,
};

export default versioninfoRepository;