const { expect } = require("chai");
const { request } = require("https");
import express from "express";
import Mocha from "mocha";

const app = express(); 

Mocha.describe("POST /goal", () => {
  Mocha.it("목표 추가에 성공했습니다.", done => {
    request(app)
      .patch("/goal") // api 요청
      .set("Content-Type", "application/json")
      .set("x-auth-token", process.env.JWT_TOKEN) // header 설정 - JWT_TOKEN은 발급받은 accessToken 넣어서 env에
      .send({
        "goalContent" : "하루에 파프리카",
        "isMore": true,
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", /json/) // 예측 content content-type
      .then(res => {
        expect(res.body.data.id).to.equal(10);
        expect(res.body.data.isSeen).to.equal(true); // response body
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
  Mocha.it("필요한 값이 없습니다.", done => {
    request(app)
      .patch("/goal")
      .set("Content-Type", "application/json")
      .set("x-auth-token", process.env.JWT_TOKEN)
      .expect(400)
      .then(res => {
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
});