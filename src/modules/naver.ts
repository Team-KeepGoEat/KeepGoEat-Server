import axios from "axios";

const naver = async (accessToken: string) => {
  console.log("######### accessToken 네이버에 검증 시작 #########");
  
  try {
    const naverUser = await axios({
      method: "GET",
      url: "https://openapi.naver.com/v1/nid/me",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const naverAccount = naverUser.data.response;

    console.log("######### naver에서 받아온 네이버 정보 ", naverAccount, " #########");

    if (!naverUser) { 
      return null 
    }
    return naverAccount;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export default naver;