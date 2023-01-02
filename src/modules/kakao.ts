import axios from "axios";
import { rm, sc } from "../constants"
import { fail, success } from "../constants/response";

const kakao = async(accessToken: string) => {
  console.log("accessToken 카카오에 검증 시작")
  
  try {
    const kakaoUser = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });

    const kakaoAccount= kakaoUser.data.kakao_account;

    // kakaoAccount 못찾아왔을 때 분기처리 로직 필요함
    console.log("kakao에서 받아온 카카오 정보 ",kakaoAccount);
    
    return kakaoAccount;

  } catch (error) {
    return null;
  }
}

export default kakao;