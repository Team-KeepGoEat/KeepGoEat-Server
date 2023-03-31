import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const findVersionInfo = async(client: string) => {
  console.log("client: ", client)
  console.log("client type: ", typeof client)

  const version =  await prisma.version_Info.findMany({
    where: {
      osType: client,
    },
    orderBy: {
      versionId: "desc"
    },
    take: 1,
  });

  return version[0];
};

const versioninfoRepository = {
  findVersionInfo,
};

export default versioninfoRepository;