import express from "express";
import request from "supertest";
import { expect } from "chai";
import app from "../app";
import router from "../router";

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", router);

app.listen(3001, () => console.log("server is listening")); 

const JWT_ACCESSTOKEN = ""  // 여기에 jwt 엑세스토큰 넣고 mocha /test/파일명 으로 실행

describe("POST /goal/achieve/:goalId with vaild param", () => {
  it("should success and return 200 statusCode", done => {
    const data = {
      isAchieved: false
    } 
    request(app)
      .post("/goal/achieve/1000") 
      .set("Content-Type", "application/json")
      .set("accesstoken", JWT_ACCESSTOKEN) 
      .send(data) 
      .expect(201) 
      .expect("Content-Type", "application/json; charset=utf-8") 
      .then(res => {
        // chai.expect(res).to.equal("성공");  
        expect(res.body.data.updatedIsAchieved).to.equal(false); // response body 예측값 검증
        done();
      })
      .catch(err => {
        console.error("######Error >>", err);
        done(err);
      })
  }); 
});