import express from "express";
import request from "supertest"
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

describe("DELETE /goal/:goalId", () => {
  it("목표 삭제에 성공했습니다.", done => {
    const JWT_ACCESSTOKEN = process.env.JWT_ACCESSTOKEN;
    request(app)
      .delete("/goal/88")
      .set("Content-Type", "application/json")
      .set("accessToken", JWT_ACCESSTOKEN) 
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.data.goalId).to.equal(88); // response body - equal문 내부에 들어갈 goalID를 매번 잘 맞게 예측해서 넣어야 함
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