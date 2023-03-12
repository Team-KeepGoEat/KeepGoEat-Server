import jwt from "jsonwebtoken";
const { JwksClient } = require("jwks-rsa");
import axios from "axios";
import tokenType from "../constants/tokenType";

const apple = async (identityToken: string) => {

  try {
    // 클라이언트에서 받아온 identityToken 복호화
    const decodedToken = jwt.decode(identityToken, { complete: true }) as {
      header: { kid: string; alg: jwt.Algorithm };
      payload: { sub: string };
    };

    // 애플은 토큰 만료 시 에러가 바로 안터지고 그냥 decodedToken이 null이 반환됨
    if (!decodedToken) {
      return tokenType.INVALID_PLATFORM_USER;
    }
    
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

    console.log("애플로그인 정보 ", verifiedDecodedToken);

    if ((verifiedDecodedToken as jwt.JwtPayload).name == null) {
      console.log("애플로그인에서 유저 이름이 등록되지 않은 경우입니다. 유저이름:  ", (verifiedDecodedToken as jwt.JwtPayload).name);

      const platformUser =  {
        name: "user" + getRandomNuber(101, 999),
        email: (verifiedDecodedToken as jwt.JwtPayload).email
      };

      console.log("platformUser로 반환 : ", platformUser);

      return platformUser;
    }

    return verifiedDecodedToken;

  } catch (error) {
    console.log("카카오 로그인 에러 발생: ", error)
    return tokenType.INVALID_PLATFORM_USER;
  } 
}

const getRandomNuber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min +1));
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

    const kakaoAccount = kakaoUser.data.kakao_account;

    /*
    if (!kakaoAccount.is_email_valid == !kakaoAccount.is_email_verified) {
      console.log("########## 해당 카카오 계정의 이메일에 문제가 있음 ########## ")
      return platformToken.INVALID_PLATFORM_USER;
    }
    */
    
    return {
      name: kakaoAccount.profile.nickname,
      email: kakaoAccount.email
    };

    return kakaoAccount;
  
  } catch (error) {
    console.log("카카오 로그인 에러 발생: ", error)
    return tokenType.INVALID_PLATFORM_USER;
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

    return {
      name: naverAccount.name,
      email: naverAccount.email
    };
  
  } catch (error) {
    console.log("네이버 로그인 에러 발생: ", error);
    return tokenType.INVALID_PLATFORM_USER;
  }
}

const sns = {
  apple, 
  kakao,
  naver
}

export default sns;