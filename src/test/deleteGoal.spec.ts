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
      .delete("/goal/145")
      .set("Content-Type", "application/json")
      .set("accessToken", JWT_ACCESSTOKEN as string) 
      .expect(200) // 예측 상태 코드
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        expect(res.body.data.goalId).to.equal(145); // response body
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  });
});