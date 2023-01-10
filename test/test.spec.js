import expect from "chai";
import request from "https";

import express from "express";
// import Mocha from "mocha";
// import { describe } from "mocha";

const app = express(); 

describe("POST /goal", () => {
  it("목표 추가에 성공했습니다.", done => {
    request(app)
      .patch("/goal") // api 요청
      .set("Content-Type", "application/json")
      .set("accesstoken", process.env.JWT_TOKEN) // header 설정 - JWT_TOKEN은 발급받은 accessToken 넣어서 env에
      .send({
        "goalContent" : "하루에 파프리카",
        "isMore": true,
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", /json/) // 예측 content content-type
      .then(res => {
        expect(res.body.data.goalId).to.equal(10); // response body - 이 부분 어떻게 처리해야하는지 몰라서 equal문 찾아보던중....
        // expect(res.body.data.isSeen).to.equal(true); // 일단 이건 확실히 아니다,,
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
  it("필요한 값이 없습니다.", done => {
    request(app)
      .patch("/goal")
      .set("Content-Type", "application/json")
      .set("accesstoken", process.env.JWT_TOKEN)
      .expect(400)
      .then(() => {
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
  it("")
});