import axios from "axios";
import platformToken from "../constants/platformToken";

const kakao = async (accessToken: string) => {
  console.log("########## accessToken 카카오에 검증 시작 ##########")
  
  try {
    const kakaoUser = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const kakaoAccount= kakaoUser.data.kakao_account;

    if (!kakaoAccount.is_email_valid == !kakaoAccount.is_email_verified) {
      console.log("########## 해당 카카오 계정의 이메일에 문제가 있음 ########## ")
      return platformToken.INVALID_PLATFORM_USER;
    }

    console.log("########## kakao에서 받아온 카카오 정보 ", kakaoAccount , " ##########");
    
    return kakaoAccount;

  } catch (error) {
    return null;
  }
}

export default kakao;