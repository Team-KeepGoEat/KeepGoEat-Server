//* 아래 주석은 dev 브랜치상의 기존 코드입니다.

// import schedule from "node-schedule";
// import { resetIsAchieved } from "./jobs";
// import app from "./app";
// import router from "./router";

// const JOB_SCHEDULE_TIME = process.env.JOB_SCHEDULE_TIME as string;
// const PORT = 3000;

// app.use("/", router); 

// app.listen(PORT, () => {
//   console.log(`
//         #############################################
//             🛡️ Server listening on port: ${PORT} 🛡️
//         #############################################
//     `);
// }); 

// const job = schedule.scheduleJob(JOB_SCHEDULE_TIME, function () {
//   resetIsAchieved();
// });

//* 1. 테스트를 위해 개발자 문서상 예제를 잠시 index.ts에 넣어둔 상태입니다. 
//* 2. String을 감싸는 작은 따옴표도 에러를 유발하여 큰 따옴표로 대체한 상태입니다. 
//* 3. var로 선언되던 변수들이 에러를 유발하여 전부 const로 변경한 상태입니다. (api_url은 let으로 선언)


import app from "./app";
import router from "./router";

const client_id = "5iWKXGDOKTf2YxMoSRyS"; 
const client_secret = "7LYdhywuGg";
const state = "RAMDOM_STATE";
const redirectURI = encodeURI("http://127.0.0.1:3000/test"); // ✅ 인자로 콜백 URL을 적어야 함, 혹시 몰라 /test로 설정
let api_url = "";
app.get("/naverlogin", function (req, res) {
  api_url = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirectURI + "&state=" + state;
   res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
   res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});
app.get("/callback", function (req, res) {
    const code = req.query.code; // 개발자 문서상에서는 const로 선언하지 않았으나 에러 발생하여 const로 수정한 상태
    const state = req.query.state; // 개발자 문서상에서는 const로 선언하지 않았으나 에러 발생하여 const로 수정한 상태
    api_url = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id="
     + client_id + "&client_secret=" + client_secret + "&redirect_uri=" + redirectURI + "&code=" + code + "&state=" + state;
    const request = require("request");
    const options = {
        url: api_url,
        headers: {"X-Naver-Client-Id":client_id, "X-Naver-Client-Secret": client_secret}
     };
    request.get(options, function (error, response, body) { // error, response, body 변수 아래 모두 빨간줄, '~~' 매개변수에는 암시적으로 'any' 형식이 포함됩니다 에러 발생
      console.log("여기까지옴")
      if (!error && response.statusCode == 200) {
        res.writeHead(200, {"Content-Type": "text/json;charset=utf-8"});
        res.end(body);
      } else {
        res.status(response.statusCode).end();
        console.log("error = " + response.statusCode);
      }
    });
});

app.listen(3000, function () {
  console.log("http://127.0.0.1:3000/naverlogin app listening on port 3000!");
});

