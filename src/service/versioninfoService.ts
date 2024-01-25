import { GetVersionInfoResponseDTO } from "../DTO/response";
import { versioninfoRepository } from "../repository";

const getVersionInfo = async(OS: string) => {
  const versionInfo = await versioninfoRepository.findVersionInfoByOS(OS);
  const responseDTO: GetVersionInfoResponseDTO = {
    version: versionInfo == null ? "1.0.0" : versionInfo.version
  }

  return responseDTO;
}; 

const versioninfoService = {
  getVersionInfo,
};

export default versioninfoService;