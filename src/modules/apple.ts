import jwt from "jsonwebtoken";
const { JwksClient } = require("jwks-rsa");
import tokenType from "../constants/tokenType";

const apple = async (identityToken: string) => {
  console.log("########## identityToken 애플에 검증 시작 ##########")

  // 클라이언트에서 받아온 identityToken 복호화
  let decodedToken;
  try { 
    decodedToken = jwt.decode(identityToken, { complete: true }) as {
      header: { kid: string; alg: jwt.Algorithm };
      payload: { sub: string };
    };
  } catch (error: any) {
    console.log("error.message ", error.message)
    if (error.message === "jwt expired") {
      console.log("만료된 apple 토큰")
      return tokenType.TOKEN_EXPIRED;
    } else {
      return tokenType.TOKEN_INVALID;
    }
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

  return verifiedDecodedToken;
}

export default apple;