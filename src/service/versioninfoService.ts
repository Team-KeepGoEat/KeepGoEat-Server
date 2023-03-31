import versioninfoRepository from "../repository/versioninfoRepository";

const getVersionInfo = async(client: string) => {
  const versionInfo = await versioninfoRepository.findVersionInfo(client);

  if (!versionInfo) {
    return "5.0.5";
  }

  return versionInfo.version;
}; 

const versioninfoService = {
  getVersionInfo,
};

export default versioninfoService;