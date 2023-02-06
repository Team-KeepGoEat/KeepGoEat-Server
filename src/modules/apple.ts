import jwt from "jsonwebtoken";
const { jwksClient, JwksClient } = require('jwks-rsa');


const apple = async (identityToken: string) => {
  console.log("########## identityToken 애플에 검증 시작 ##########")

  const decodedToken = jwt.decode(identityToken, { complete: true }) as {
    header: { kid: string; alg: jwt.Algorithm };
    payload: { sub: string };
  };

  const keyIdFromToken = decodedToken.header.kid;
  console.log("keyIdFromToken ", keyIdFromToken)
  const applePublicKeyUrl = "https://appleid.apple.com/auth/keys";
  
  const jwksClient = new JwksClient({ jwksUri: applePublicKeyUrl });
  console.log("jwksClient", jwksClient);
  const key = await jwksClient.getSigningKey(keyIdFromToken);
  const publicKey = key.getPublicKey();

  const verifiedDecodedToken = jwt.verify(identityToken, publicKey, {
    algorithms: [decodedToken.header.alg]
  });

  console.log("verifiedDecodedToken: ", verifiedDecodedToken)

  return verifiedDecodedToken;
}

export default apple;