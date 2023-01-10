// import expect from "chai";
// import { Request } from "express";
// import request from "https";
import express from "express";
// import assert from "assert";
import request from "supertest"
const app = express(); 
// const request = require('supertest');
// import { env } from "node:process";


describe("POST /goal", () => {
  it("목표 추가에 성공했습니다.", done => {
    request(app)
      .patch("/goal") // api 요청
      .set("Content-Type", "application/json")
      .set("accessToken", process.env.JWT_TOKEN) // header 설정 
      .send({
        "goalContent" : "하루에 파프리카",
        "isMore": true,
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", "/json") // 예측 content content-type
      .then(res => {
        expect(res.body.data.goalId).to.equal(1); // response body
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
      .set("accessToken", process.env.JWT_TOKEN)
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