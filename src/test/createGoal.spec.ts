import express from "express";
import request from "supertest"
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("POST /goal", () => {
  it("목표 추가에 성공했습니다.", done => {
    const JWT_ACCESSTOKEN = process.env.JWT_ACCESSTOKEN;
    request(app)
      .post("/goal")
      .set("Content-Type", "application/json")
      .set("accessToken", JWT_ACCESSTOKEN as string) 
      .send({
        "goalContent" : "하루에 파프리카",
        "isMore": true,
      }) // request body
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.success).to.equal(true); // response body - equal문 내부에 들어갈 goalID를 매번 잘 맞게 예측해서 넣어야 함
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
  // it("필요한 값이 없습니다.", done => {
  //   request(app)
  //     .patch("/goal")
  //     .set("Content-Type", "application/json")
  //     .set("accessToken", JWT_ACCESSTOKEN)
  //     .expect(400)
  //     .then(() => {
  //       done();
  //     })
  //     .catch(err => {
  //       console.error("######Error >>", err);
  //       done(err);
  //     })
  // });
});