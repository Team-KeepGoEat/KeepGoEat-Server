import jwt from "jsonwebtoken";
const { JwksClient } = require("jwks-rsa");
import axios from "axios";
import { rm } from "../constants";

const apple = async (identityToken: string) => {
  console.log("########## identityToken 애플에 검증 시작 ##########")

  // 클라이언트에서 받아온 identityToken 복호화
  const decodedToken = jwt.decode(identityToken, { complete: true }) as {
    header: { kid: string; alg: jwt.Algorithm };
    payload: { sub: string };
  };
  
  // 복호화한 토큰에서 keyId 가져옴
  const keyId = decodedToken.header.kid
  
  // 애플 Public Key URL에서 JWKS(Json Web Key Set)을 가져옴
  const applePublicKeyUrl = "https://appleid.apple.com/auth/keys";
  const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });
  
  // identityToken의 keyId와 대응하는 JWKS의 key set이 있어야 함. 해당 key set에서 signingKey를 가져옴
  const signingKey = await jwksClient.getSigningKey(keyId);
  
  // signingKey에서 publicKey를 가져옴
  const publicKey = signingKey.getPublicKey();

  // publicKey로 identityToken 유효성 검사. 알고리즘 정보는 identityToken 헤더에 있는 걸 사용
  const verifiedDecodedToken = jwt.verify(identityToken, publicKey, {
    algorithms: [decodedToken.header.alg]
  });

  return verifiedDecodedToken;
}


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
      return rm.NOT_EXISITING_USER;
    }
    return naverAccount;
  } catch (error) {
    console.log(error)
    return null;
  }
}

const sns = {
  apple, 
  kakao,
  naver
}

export default sns;