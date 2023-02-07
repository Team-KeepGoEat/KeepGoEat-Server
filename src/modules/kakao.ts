import axios from "axios";
import platformToken from "../constants/platformToken";

const kakao = async (accessToken: string) => {
  
  try {
    const kakaoUser = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const kakaoAccount= kakaoUser.data.kakao_account;

    /*
    if (!kakaoAccount.is_email_valid == !kakaoAccount.is_email_verified) {
      console.log("########## 해당 카카오 계정의 이메일에 문제가 있음 ########## ")
      return platformToken.INVALID_PLATFORM_USER;
    }
    */
    
    return kakaoAccount;

  } catch (error) {
    return null;
  }
}

export default kakao;